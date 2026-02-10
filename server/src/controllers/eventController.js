import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';
import Registration from '../models/Registration.js';

// POST /api/events
export const createEvent = async (req, res, next) => {
     try {
          const event = await Event.create({ ...req.body, organizer: req.user._id });
          res.status(201).json({ success: true, event });
     } catch (error) {
          next(error);
     }
};

// GET /api/events
export const getEvents = async (req, res, next) => {
     try {
          const { status, page = 1, limit = 20 } = req.query;
          const filter = {};

          // Organizers/Staff see their own events; Attendees see published
          if (['Organizer', 'Staff'].includes(req.user.role)) {
               filter.organizer = req.user._id;
          } else if (req.user.role !== 'SuperAdmin') {
               filter.status = 'published';
          }

          if (status) filter.status = status;

          const events = await Event.find(filter)
               .populate('organizer', 'name email')
               .sort({ startDate: -1 })
               .skip((page - 1) * limit)
               .limit(Number(limit));

          const total = await Event.countDocuments(filter);
          res.json({ success: true, events, total, page: Number(page), pages: Math.ceil(total / limit) });
     } catch (error) {
          next(error);
     }
};

// GET /api/events/:id
export const getEvent = async (req, res, next) => {
     try {
          const event = await Event.findById(req.params.id).populate('organizer', 'name email');
          if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
          res.json({ success: true, event });
     } catch (error) {
          next(error);
     }
};

// PUT /api/events/:id
export const updateEvent = async (req, res, next) => {
     try {
          const event = await Event.findById(req.params.id);
          if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

          if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'SuperAdmin') {
               return res.status(403).json({ success: false, message: 'Not authorized' });
          }

          Object.assign(event, req.body);
          await event.save();
          res.json({ success: true, event });
     } catch (error) {
          next(error);
     }
};

// DELETE /api/events/:id
export const deleteEvent = async (req, res, next) => {
     try {
          const event = await Event.findById(req.params.id);
          if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

          if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'SuperAdmin') {
               return res.status(403).json({ success: false, message: 'Not authorized' });
          }

          await event.deleteOne();
          res.json({ success: true, message: 'Event deleted' });
     } catch (error) {
          next(error);
     }
};

// POST /api/events/:id/duplicate
export const duplicateEvent = async (req, res, next) => {
     try {
          const original = await Event.findById(req.params.id);
          if (!original) return res.status(404).json({ success: false, message: 'Event not found' });

          const duplicated = await Event.create({
               ...original.toObject(),
               _id: undefined,
               title: `${original.title} (Copy)`,
               status: 'draft',
               duplicatedFrom: original._id,
               createdAt: undefined,
               updatedAt: undefined,
          });

          res.status(201).json({ success: true, event: duplicated });
     } catch (error) {
          next(error);
     }
};

// GET /api/events/:id/dashboard
export const getDashboard = async (req, res, next) => {
     try {
          const eventId = req.params.id;

          const [totalRegistrations, confirmedRegistrations, revenue, recentRegistrations] = await Promise.all([
               Registration.countDocuments({ event: eventId }),
               Registration.countDocuments({ event: eventId, status: 'confirmed' }),
               Registration.aggregate([
                    { $match: { event: new (await import('mongoose')).default.Types.ObjectId(eventId), paymentStatus: 'paid' } },
                    { $group: { _id: null, total: { $sum: '$amount' } } },
               ]),
               Registration.find({ event: eventId })
                    .populate('user', 'name email')
                    .populate('ticket', 'name type')
                    .sort({ createdAt: -1 })
                    .limit(10),
          ]);

          const tickets = await Ticket.find({ event: eventId });

          res.json({
               success: true,
               dashboard: {
                    totalRegistrations,
                    confirmedRegistrations,
                    revenue: revenue[0]?.total || 0,
                    recentRegistrations,
                    tickets,
                    checkedIn: await Registration.countDocuments({ event: eventId, checkedIn: true }),
               },
          });
     } catch (error) {
          next(error);
     }
};
