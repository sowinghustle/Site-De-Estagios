import { Router } from 'express';
import UserController from './controller';

const routes = Router();
const controller = new UserController();

routes.get('', controller.index);
routes.post('', controller.create);
routes.put('/:id', controller.update);
routes.get('/:id', controller.findById);
routes.delete('/:id', controller.delete);

export default routes;
