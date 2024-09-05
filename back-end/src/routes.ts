require('express-async-errors');

import userRoutes from './user/routes';
import adminRoutes from './admin/routes';
import logoutRoutes from './logout/routes';
import { Router } from 'express';
import respMessages from './config/responseMessages';

export default function () {
    const routes = Router();

    routes.get('/', (req, res) => res.send(respMessages.welcome));
    routes.use('/user', userRoutes);
    routes.use('/admin', adminRoutes);
    routes.use('/logout', logoutRoutes);

    return routes;
}
