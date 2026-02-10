import { Router } from 'express';
import { search, suggest } from '../controllers/searchController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', search);
router.get('/suggest', suggest);

export default router;
