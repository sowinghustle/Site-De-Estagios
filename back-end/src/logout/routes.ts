import { Router } from 'express';
import LogoutController from './controller';
import { ensureIsAuthenticated } from '../auth/passport/ensure-is-auth';

const routes = Router();
const controller = new LogoutController();

routes.get('', ensureIsAuthenticated, controller.logout);

export default routes;
