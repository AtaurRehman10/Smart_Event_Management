import { Router } from 'express';
import { createPoll, getPollsBySession, votePoll, createQuestion, getQuestionsBySession, upvoteQuestion, approveQuestion } from '../controllers/pollController.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.use(auth);

router.post('/', roleGuard('Organizer', 'SuperAdmin', 'Staff'), createPoll);
router.get('/session/:sessionId', getPollsBySession);
router.post('/:id/vote', votePoll);
router.post('/questions', createQuestion);
router.get('/questions/session/:sessionId', getQuestionsBySession);
router.post('/questions/:id/upvote', upvoteQuestion);
router.patch('/questions/:id/approve', roleGuard('Organizer', 'SuperAdmin', 'Staff'), approveQuestion);

export default router;
