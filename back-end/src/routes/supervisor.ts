import { Router } from 'express';
import SupervisorController from '../controllers/supervisor';

const controller = new SupervisorController();
const routes = Router();

routes.post('/login', controller.login);
routes.post('/register', controller.register);

export default routes;
