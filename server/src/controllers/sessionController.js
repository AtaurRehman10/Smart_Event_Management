import Session from '../models/Session.js';

// POST /api/sessions
export const createSession = async (req, res, next) => {
     try {
          const session = await Session.create(req.body);
          res.status(201).json({ success: true, session });
     } catch (error) {
          next(error);
     }
};

// GET /api/sessions/event/:eventId
export const getSessionsByEvent = async (req, res, next) => {
     try {
          const sessions = await Session.find({ event: req.params.eventId })
               .populate('speaker', 'name email')
               .sort({ startTime: 1 });
          res.json({ success: true, sessions });
     } catch (error) {
          next(error);
     }
};

// PUT /api/sessions/:id
export const updateSession = async (req, res, next) => {
     try {
          const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
          if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
          res.json({ success: true, session });
     } catch (error) {
          next(error);
     }
};

// DELETE /api/sessions/:id
export const deleteSession = async (req, res, next) => {
     try {
          const session = await Session.findByIdAndDelete(req.params.id);
          if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
          res.json({ success: true, message: 'Session deleted' });
     } catch (error) {
          next(error);
     }
};

// POST /api/sessions/:id/join
export const joinSession = async (req, res, next) => {
     try {
          const session = await Session.findById(req.params.id);
          if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

          if (session.attendees.includes(req.user._id)) {
               return res.status(400).json({ success: false, message: 'Already joined' });
          }

          if (session.registered >= session.capacity) {
               session.waitlist.push(req.user._id);
               await session.save();
               return res.json({ success: true, message: 'Added to waitlist', waitlisted: true });
          }

          session.attendees.push(req.user._id);
          session.registered += 1;
          await session.save();

          res.json({ success: true, message: 'Joined session', session });
     } catch (error) {
          next(error);
     }
};

// POST /api/sessions/:id/leave
export const leaveSession = async (req, res, next) => {
     try {
          const session = await Session.findById(req.params.id);
          if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

          session.attendees = session.attendees.filter(a => a.toString() !== req.user._id.toString());
          session.waitlist = session.waitlist.filter(a => a.toString() !== req.user._id.toString());
          session.registered = Math.max(0, session.registered - 1);

          // Promote from waitlist
          if (session.waitlist.length > 0 && session.registered < session.capacity) {
               const promoted = session.waitlist.shift();
               session.attendees.push(promoted);
               session.registered += 1;
          }

          await session.save();
          res.json({ success: true, message: 'Left session' });
     } catch (error) {
          next(error);
     }
};

// POST /api/sessions/check-conflicts
export const checkConflicts = async (req, res, next) => {
     try {
          const { eventId, startTime, endTime, room, speakerId, excludeSessionId } = req.body;

          const conflicts = [];

          // Check venue double-booking
          if (room) {
               const venueConflict = await Session.findOne({
                    event: eventId,
                    room,
                    _id: { $ne: excludeSessionId },
                    $or: [
                         { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
                    ],
               });
               if (venueConflict) {
                    conflicts.push({ type: 'venue', message: `Room "${room}" is already booked for "${venueConflict.title}"`, session: venueConflict });
               }
          }

          // Check speaker conflicts
          if (speakerId) {
               const speakerConflict = await Session.findOne({
                    event: eventId,
                    speaker: speakerId,
                    _id: { $ne: excludeSessionId },
                    $or: [
                         { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
                    ],
               });
               if (speakerConflict) {
                    conflicts.push({ type: 'speaker', message: `Speaker is already scheduled for "${speakerConflict.title}"`, session: speakerConflict });
               }
          }

          res.json({ success: true, conflicts, hasConflicts: conflicts.length > 0 });
     } catch (error) {
          next(error);
     }
};
