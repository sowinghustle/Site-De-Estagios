import { Router } from 'express';
import * as controller from './controller';
import { authenticate } from './passport';

const routes = Router();

routes.get('', authenticate(), controller.index);

export default routes;
