import { Router } from 'express';
import { createBadge, getBadgesByEvent, updateBadge, deleteBadge } from '../controllers/badgeController.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.use(auth);

router.get('/event/:eventId', getBadgesByEvent);
router.post('/', roleGuard('Organizer', 'SuperAdmin'), createBadge);
router.put('/:id', roleGuard('Organizer', 'SuperAdmin'), updateBadge);
router.delete('/:id', roleGuard('Organizer', 'SuperAdmin'), deleteBadge);

export default router;
