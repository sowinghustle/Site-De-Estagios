import config from './config';
import { requestWithSupertest } from './config/testing';

it('GET /healthcheck should return 200 status code', async () => {
    const res = await requestWithSupertest.get('/healthcheck');
    expect(res.status).toBe(200);
});

it('GET / should return correct message', async () => {
    const res = await requestWithSupertest.get('/');
    expect(res.text).toEqual(config.messages.welcomeMessage);
});
