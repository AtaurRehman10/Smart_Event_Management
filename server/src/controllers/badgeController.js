import Badge from '../models/Badge.js';

// POST /api/badges
export const createBadge = async (req, res, next) => {
     try {
          const badge = await Badge.create(req.body);
          res.status(201).json({ success: true, badge });
     } catch (error) {
          next(error);
     }
};

// GET /api/badges/event/:eventId
export const getBadgesByEvent = async (req, res, next) => {
     try {
          const badges = await Badge.find({ event: req.params.eventId });
          res.json({ success: true, badges });
     } catch (error) {
          next(error);
     }
};

// PUT /api/badges/:id
export const updateBadge = async (req, res, next) => {
     try {
          const badge = await Badge.findByIdAndUpdate(req.params.id, req.body, { new: true });
          if (!badge) return res.status(404).json({ success: false, message: 'Badge not found' });
          res.json({ success: true, badge });
     } catch (error) {
          next(error);
     }
};

// DELETE /api/badges/:id
export const deleteBadge = async (req, res, next) => {
     try {
          await Badge.findByIdAndDelete(req.params.id);
          res.json({ success: true, message: 'Badge deleted' });
     } catch (error) {
          next(error);
     }
};
