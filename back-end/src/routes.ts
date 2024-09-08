require('express-async-errors');

import { Router } from 'express';
import adminRoutes from './admin/routes';
import respMessages from './config/responseMessages';
import logoutRoutes from './logout/routes';
import userRoutes from './user/routes';

export default function () {
    const routes = Router();

    routes.get('/', (req, res) => res.send(respMessages.welcome));
    routes.use('/user', userRoutes);
    routes.use('/admin', adminRoutes);
    routes.use('/logout', logoutRoutes);

    return routes;
}
