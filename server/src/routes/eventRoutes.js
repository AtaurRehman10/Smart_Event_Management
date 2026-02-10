import { Router } from 'express';
import { createEvent, getEvents, getEvent, updateEvent, deleteEvent, duplicateEvent, getDashboard } from '../controllers/eventController.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.use(auth);

router.get('/', getEvents);
router.get('/:id', getEvent);
router.get('/:id/dashboard', roleGuard('Organizer', 'SuperAdmin'), getDashboard);
router.post('/', roleGuard('Organizer', 'SuperAdmin'), createEvent);
router.put('/:id', roleGuard('Organizer', 'SuperAdmin'), updateEvent);
router.delete('/:id', roleGuard('Organizer', 'SuperAdmin'), deleteEvent);
router.post('/:id/duplicate', roleGuard('Organizer', 'SuperAdmin'), duplicateEvent);

export default router;
