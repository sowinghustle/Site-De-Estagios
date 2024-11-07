import { Router } from 'express';
import 'express-async-errors';
import adminRoutes from '../../routes/admin';
import logoutRoutes from '../../routes/logout';
import studentRoutes from '../../routes/student';
import supervisorRoutes from '../../routes/supervisor';
import userRoutes from '../../routes/user';

export default function () {
    const routes = Router();

    routes.use('/user', userRoutes);
    routes.use('/admin', adminRoutes);
    routes.use('/supervisor', supervisorRoutes);
    routes.use('/student', studentRoutes);
    routes.use('/logout', logoutRoutes);

    return routes;
}
