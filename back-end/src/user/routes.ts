import { Router } from 'express';
import ensureIsAuthenticated from '../auth/passport/ensure-is-auth';
import UserController from './controller';

const controller = new UserController();
const routes = Router();

routes.get('/me', ensureIsAuthenticated, controller.me);

export default routes;
