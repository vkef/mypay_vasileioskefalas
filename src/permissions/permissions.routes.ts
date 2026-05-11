import { Router } from 'express';
import { requireApiKey } from '../middleware/authMiddleware';
import {
  getPermissionsHandler,
  updatePermissionsHandler,
} from './permissions.controller';

const router = Router();

router.get('/api/users/permissions/:user_id', requireApiKey, getPermissionsHandler);
router.put('/api/users/permissions/:user_id', requireApiKey, updatePermissionsHandler);

export default router;
