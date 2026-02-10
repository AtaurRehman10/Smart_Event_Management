import User from '../models/User.js';
import Event from '../models/Event.js';
import Session from '../models/Session.js';

// GET /api/search
export const search = async (req, res, next) => {
     try {
          const { q, type = 'all', industry, interests, page = 1, limit = 20 } = req.query;

          if (!q) return res.json({ success: true, results: [] });

          const results = {};

          if (type === 'all' || type === 'attendees') {
               const userFilter = { $text: { $search: q } };
               if (industry) userFilter.industry = industry;
               if (interests) userFilter.interests = { $in: interests.split(',') };

               results.attendees = await User.find(userFilter)
                    .select('name email organization industry interests profilePic')
                    .limit(Number(limit))
                    .skip((page - 1) * limit);
          }

          if (type === 'all' || type === 'sessions') {
               results.sessions = await Session.find({ $text: { $search: q } })
                    .populate('speaker', 'name')
                    .limit(Number(limit))
                    .skip((page - 1) * limit);
          }

          if (type === 'all' || type === 'events') {
               results.events = await Event.find({ $text: { $search: q }, status: 'published' })
                    .populate('organizer', 'name')
                    .limit(Number(limit))
                    .skip((page - 1) * limit);
          }

          res.json({ success: true, results, query: q });
     } catch (error) {
          next(error);
     }
};

// GET /api/search/suggest
export const suggest = async (req, res, next) => {
     try {
          const { q } = req.query;
          if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });

          const regex = new RegExp(q, 'i');

          const [users, sessions, events] = await Promise.all([
               User.find({ name: regex }).select('name role').limit(5),
               Session.find({ title: regex }).select('title').limit(5),
               Event.find({ title: regex, status: 'published' }).select('title').limit(5),
          ]);

          const suggestions = [
               ...users.map(u => ({ type: 'attendee', text: u.name, id: u._id })),
               ...sessions.map(s => ({ type: 'session', text: s.title, id: s._id })),
               ...events.map(e => ({ type: 'event', text: e.title, id: e._id })),
          ];

          res.json({ success: true, suggestions });
     } catch (error) {
          next(error);
     }
};
