import { Router } from 'express';
import { UserController } from './controller';

const routes = Router();
const controller = new UserController();

routes.get('', controller.index);
routes.post('', controller.createUser);
routes.get('/:id', controller.getUser);
routes.put('/:id', controller.updateUser);
routes.delete('/:id', controller.deleteUser);

export default routes;
