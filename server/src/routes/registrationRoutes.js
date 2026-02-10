import { Router } from 'express';
import { createRegistration, getRegistrationsByEvent, getMyRegistrations, cancelRegistration, checkinRegistration, exportRegistrations } from '../controllers/registrationController.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.use(auth);

router.post('/', createRegistration);
router.get('/me', getMyRegistrations);
router.get('/event/:eventId', roleGuard('Organizer', 'SuperAdmin', 'Staff'), getRegistrationsByEvent);
router.get('/event/:eventId/export', roleGuard('Organizer', 'SuperAdmin'), exportRegistrations);
router.patch('/:id/cancel', cancelRegistration);
router.post('/:id/checkin', roleGuard('Organizer', 'SuperAdmin', 'Staff'), checkinRegistration);

export default router;
