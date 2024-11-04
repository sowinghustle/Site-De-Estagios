import { Router } from 'express';
import UserController from '../controllers/user';
import ensureIsAuthenticated from '../modules/passport/ensure-is-auth';

const controller = new UserController();
const routes = Router();

routes.get('/me', ensureIsAuthenticated, controller.me);
routes.post('/forgot-password', controller.requestResetPassword);
routes.post('/reset-password', controller.resetPassword);

export default routes;
