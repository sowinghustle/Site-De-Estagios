import { Router } from 'express';
import { ensureIsAuthenticated } from '../auth/passport/ensure-is-auth';
import LogoutController from './controller';

const routes = Router();
const controller = new LogoutController();

routes.get('', ensureIsAuthenticated, controller.logout);

export default routes;
