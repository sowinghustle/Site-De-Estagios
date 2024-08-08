require('express-async-errors');

import authRoutes from './auth/routes';
import userRoutes from './user/routes';
import adminRoutes from './admin/routes';
import { Router } from 'express';

export default function () {
    const routes = Router();

    routes.get('/', (req, res) => res.send('Bem vindo'));
    routes.use('/auth', authRoutes);
    routes.use('/user', userRoutes);
    routes.use('/admin', adminRoutes);

    return routes;
}
