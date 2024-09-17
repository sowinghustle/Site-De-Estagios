import { Router } from 'express';
import 'express-async-errors';
import adminRoutes from './admin/routes';
import config from './config';
import logoutRoutes from './logout/routes';
import supervisorRoutes from './supervisor/routes';
import userRoutes from './user/routes';

export default function () {
    const routes = Router();

    routes.get('/', (req, res) => res.send(config.messages.welcomeMessage));
    routes.use('/user', userRoutes);
    routes.use('/admin', adminRoutes);
    routes.use('/supervisor', supervisorRoutes);
    routes.use('/logout', logoutRoutes);

    return routes;
}
