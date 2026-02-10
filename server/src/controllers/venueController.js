import FloorPlan from '../models/FloorPlan.js';
import Venue from '../models/Venue.js';

// POST /api/venues
export const createVenue = async (req, res, next) => {
     try {
          const venue = await Venue.create(req.body);
          res.status(201).json({ success: true, venue });
     } catch (error) {
          next(error);
     }
};

// GET /api/venues/event/:eventId
export const getVenuesByEvent = async (req, res, next) => {
     try {
          const venues = await Venue.find({ event: req.params.eventId }).populate('floorPlans');
          const floorPlans = await FloorPlan.find({ event: req.params.eventId });
          res.json({ success: true, venues, floorPlans });
     } catch (error) {
          next(error);
     }
};

// PUT /api/venues/:id
export const updateVenue = async (req, res, next) => {
     try {
          const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
          if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });
          res.json({ success: true, venue });
     } catch (error) {
          next(error);
     }
};

// DELETE /api/venues/:id
export const deleteVenue = async (req, res, next) => {
     try {
          await Venue.findByIdAndDelete(req.params.id);
          res.json({ success: true, message: 'Venue deleted' });
     } catch (error) {
          next(error);
     }
};

// POST /api/venues/floorplan
export const saveFloorPlan = async (req, res, next) => {
     try {
          const { id, ...data } = req.body;
          let floorPlan;
          if (id) {
               floorPlan = await FloorPlan.findByIdAndUpdate(id, data, { new: true });
          } else {
               floorPlan = await FloorPlan.create(data);
          }
          res.json({ success: true, floorPlan });
     } catch (error) {
          next(error);
     }
};

// GET /api/venues/floorplan/:id
export const getFloorPlan = async (req, res, next) => {
     try {
          const floorPlan = await FloorPlan.findById(req.params.id);
          if (!floorPlan) return res.status(404).json({ success: false, message: 'Floor plan not found' });
          res.json({ success: true, floorPlan });
     } catch (error) {
          next(error);
     }
};
