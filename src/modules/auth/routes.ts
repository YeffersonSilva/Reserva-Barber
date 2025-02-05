

import { Router } from 'express';
import { authController } from './index'; 
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));

router.get(
    "/firebase-token/:id",
    authMiddleware,
    (req, res, next) => authController.getFirebaseToken(req, res, next)
);
  
router.post('/refresh-token', (req, res, next) => authController.refreshToken(req, res, next));


export default router;
