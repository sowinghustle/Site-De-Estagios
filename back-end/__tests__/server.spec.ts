import app from '../src/app';
import request from 'supertest';

describe('Server.ts tests', () => {
    test('Catch-all route', async () => {
        const res = await request(app).get('/api/v1');
        expect(res.text).toEqual('Bem vindo');
    });
});
