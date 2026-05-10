import { Router } from 'express';
import {
  getPermissionsHandler,
  updatePermissionsHandler,
} from './permissions.controller';

const router = Router();

router.get('/api/users/permissions/:user_id', getPermissionsHandler);
router.put('/api/users/permissions/:user_id', updatePermissionsHandler);

export default router;
