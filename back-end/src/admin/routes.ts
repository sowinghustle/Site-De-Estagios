import { Router } from 'express';
import AdminController from './controller';

const controller = new AdminController();
const routes = Router();

routes.post('/login', controller.login);

export default routes;
