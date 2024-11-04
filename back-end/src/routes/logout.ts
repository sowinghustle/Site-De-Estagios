import { Router } from 'express';
import LogoutController from '../controllers/logout';
import ensureIsAuthenticated from '../modules/passport/ensure-is-auth';

const routes = Router();
const controller = new LogoutController();

routes.delete('', ensureIsAuthenticated, controller.logout);

export default routes;
