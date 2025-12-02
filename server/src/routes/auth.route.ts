import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { signupSchema, loginSchema, refreshTokenSchema } from '../schemas/auth.schema';

const authRouter: Router = Router();

authRouter.post('/signup', validate(signupSchema), authController.signup);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/refresh', validate(refreshTokenSchema), authController.refresh);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.get('/me', authenticate, authController.me);

export default authRouter;