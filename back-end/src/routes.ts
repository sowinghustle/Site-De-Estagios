import exampleRoutes from './example/routes';
import authRoutes from './auth/routes';
import userRoutes from './user/routes';
import { Router } from 'express';

export default function () {
    const routes = Router();

    routes.get('/', (req, res) => res.send('Bem vindo'));
    routes.use('/auth', authRoutes);
    routes.use('/example', exampleRoutes);
    routes.use('/user', userRoutes);

    return routes;
}
