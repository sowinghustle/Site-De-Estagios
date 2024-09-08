import { randomUUID } from 'crypto';
import supertest from 'supertest';
import app from '../app';

export const requestWithSupertest = supertest(app);
export const token = randomUUID();

jest.mock('../token/service', () => {
    return {
        generateUserToken: () => token,
    };
});
