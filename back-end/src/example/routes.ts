import { Router } from 'express';
import * as controller from './controller';

const routes = Router();

routes.get("", controller.index);
routes.post("", controller.createItem);
routes.get('/:id', controller.getItem);
routes.put('/:id', controller.updateItem);
routes.delete('/:id', controller.deleteItem);

export default routes;
