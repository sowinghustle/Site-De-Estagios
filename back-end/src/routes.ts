import { Router } from 'express';
import 'express-async-errors';
import adminRoutes from './admin/routes';
import logoutRoutes from './logout/routes';
import studentRoutes from './student/routes';
import supervisorRoutes from './supervisor/routes';
import userRoutes from './user/routes';

export default function () {
    const routes = Router();

    routes.use('/user', userRoutes);
    routes.use('/admin', adminRoutes);
    routes.use('/supervisor', supervisorRoutes);
    routes.use('/student', studentRoutes);
    routes.use('/logout', logoutRoutes);

    return routes;
}
