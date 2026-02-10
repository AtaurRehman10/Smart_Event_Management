import { Router } from 'express';
import { createVenue, getVenuesByEvent, updateVenue, deleteVenue, saveFloorPlan, getFloorPlan } from '../controllers/venueController.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.use(auth);

router.get('/event/:eventId', getVenuesByEvent);
router.post('/', roleGuard('Organizer', 'SuperAdmin'), createVenue);
router.put('/:id', roleGuard('Organizer', 'SuperAdmin'), updateVenue);
router.delete('/:id', roleGuard('Organizer', 'SuperAdmin'), deleteVenue);
router.post('/floorplan', roleGuard('Organizer', 'SuperAdmin'), saveFloorPlan);
router.get('/floorplan/:id', getFloorPlan);

export default router;
