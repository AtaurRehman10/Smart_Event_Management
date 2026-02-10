import Registration from '../models/Registration.js';
import Ticket from '../models/Ticket.js';
import QRCode from 'qrcode';


// POST /api/registrations
export const createRegistration = async (req, res, next) => {
     try {
          const { eventId, ticketId, formResponses } = req.body;

          // Check if already registered
          const existing = await Registration.findOne({ user: req.user._id, event: eventId });
          if (existing) {
               return res.status(400).json({ success: false, message: 'Already registered for this event' });
          }

          // Get ticket and check availability
          const ticket = await Ticket.findById(ticketId);
          if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

          const isWaitlisted = ticket.sold >= ticket.quantity;

          // Calculate price
          let price = ticket.currentPrice;

          // Generate QR code
          const qrData = `devcon-reg-${Date.now()}-${req.user._id}`;
          const qrCode = await QRCode.toDataURL(qrData);

          const registration = await Registration.create({
               user: req.user._id,
               event: eventId,
               ticket: ticketId,
               status: isWaitlisted ? 'waitlisted' : 'pending',
               formResponses,
               qrCode,
               amount: price,
          });

          if (!isWaitlisted) {
               ticket.sold += 1;
               await ticket.save();
          }

          await registration.populate(['user', { path: 'ticket', select: 'name type price' }]);
          res.status(201).json({ success: true, registration });
     } catch (error) {
          next(error);
     }
};

// GET /api/registrations/event/:eventId
export const getRegistrationsByEvent = async (req, res, next) => {
     try {
          const { status, page = 1, limit = 50 } = req.query;
          const filter = { event: req.params.eventId };
          if (status) filter.status = status;

          const registrations = await Registration.find(filter)
               .populate('user', 'name email organization')
               .populate('ticket', 'name type price')
               .sort({ createdAt: -1 })
               .skip((page - 1) * limit)
               .limit(Number(limit));

          const total = await Registration.countDocuments(filter);
          res.json({ success: true, registrations, total });
     } catch (error) {
          next(error);
     }
};

// GET /api/registrations/me
export const getMyRegistrations = async (req, res, next) => {
     try {
          const registrations = await Registration.find({ user: req.user._id })
               .populate({ path: 'event', select: 'title startDate endDate location' })
               .populate('ticket', 'name type')
               .sort({ createdAt: -1 });

          res.json({ success: true, registrations });
     } catch (error) {
          next(error);
     }
};

// PATCH /api/registrations/:id/cancel
export const cancelRegistration = async (req, res, next) => {
     try {
          const registration = await Registration.findById(req.params.id);
          if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

          registration.status = 'cancelled';
          await registration.save();

          // Decrement ticket sold count
          await Ticket.findByIdAndUpdate(registration.ticket, { $inc: { sold: -1 } });

          // Promote from waitlist
          const nextInLine = await Registration.findOne({
               event: registration.event,
               ticket: registration.ticket,
               status: 'waitlisted',
          }).sort({ createdAt: 1 });

          if (nextInLine) {
               nextInLine.status = 'confirmed';
               await nextInLine.save();
               await Ticket.findByIdAndUpdate(registration.ticket, { $inc: { sold: 1 } });
          }

          res.json({ success: true, message: 'Registration cancelled' });
     } catch (error) {
          next(error);
     }
};

// POST /api/registrations/:id/checkin
export const checkinRegistration = async (req, res, next) => {
     try {
          const registration = await Registration.findById(req.params.id);
          if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

          registration.checkedIn = true;
          registration.checkInTime = new Date();
          await registration.save();

          res.json({ success: true, message: 'Checked in successfully', registration });
     } catch (error) {
          next(error);
     }
};

// GET /api/registrations/event/:eventId/export
export const exportRegistrations = async (req, res, next) => {
     try {
          const registrations = await Registration.find({ event: req.params.eventId })
               .populate('user', 'name email organization phone')
               .populate('ticket', 'name type price');

          const data = registrations.map(r => ({
               Name: r.user?.name,
               Email: r.user?.email,
               Organization: r.user?.organization,
               Ticket: r.ticket?.name,
               Type: r.ticket?.type,
               Amount: r.amount,
               Status: r.status,
               CheckedIn: r.checkedIn ? 'Yes' : 'No',
               RegisteredAt: r.createdAt?.toISOString(),
          }));

          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=registrations.csv');

          const headers = Object.keys(data[0] || {}).join(',');
          const rows = data.map(d => Object.values(d).join(','));
          res.send([headers, ...rows].join('\n'));
     } catch (error) {
          next(error);
     }
};
