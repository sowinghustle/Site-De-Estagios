import { randomUUID } from 'crypto';
import app from '../app';
import supertest from 'supertest';

export const requestWithSupertest = supertest(app);
export const token = randomUUID();

jest.mock('../token/service', () => {
    return {
        generateUserToken: () => token,
    };
});
