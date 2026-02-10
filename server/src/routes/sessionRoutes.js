import { Router } from 'express';
import { createSession, getSessionsByEvent, updateSession, deleteSession, joinSession, leaveSession, checkConflicts } from '../controllers/sessionController.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.use(auth);

router.get('/event/:eventId', getSessionsByEvent);
router.post('/', roleGuard('Organizer', 'SuperAdmin', 'Staff'), createSession);
router.put('/:id', roleGuard('Organizer', 'SuperAdmin', 'Staff'), updateSession);
router.delete('/:id', roleGuard('Organizer', 'SuperAdmin', 'Staff'), deleteSession);
router.post('/:id/join', joinSession);
router.post('/:id/leave', leaveSession);
router.post('/check-conflicts', roleGuard('Organizer', 'SuperAdmin', 'Staff'), checkConflicts);

export default router;
