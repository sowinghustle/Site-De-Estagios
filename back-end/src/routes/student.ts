import { Router } from 'express';
import StudentController from '../controllers/student';

const controller = new StudentController();
const routes = Router();

routes.post('/login', controller.login);
routes.post('/register', controller.register);

export default routes;
