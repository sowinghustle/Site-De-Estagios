import { Router } from 'express';
import AdminController from './controller';

const routes = Router();
const controller = { _() {} };

routes.get('', controller._);

export default routes;
