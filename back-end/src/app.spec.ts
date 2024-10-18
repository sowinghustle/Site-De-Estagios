import config from './config';
import { requestWithSupertest } from './config/testing';

it('GET /healthcheck should return 200 status code', async () => {
    const res = await requestWithSupertest.get('/healthcheck');
    expect(res.status).toEqual(200);
});

it('GET / should return correct message', async () => {
    const res = await requestWithSupertest.get('/');
    expect(res.text).toEqual(config.messages.welcomeMessage);
});

it('GET /not-existent-route should return 404', async () => {
    const expectedResultValue = {
        success: false,
        message: config.messages.routeNotFound,
    };
    const res = await requestWithSupertest.get('/non-existent-route');
    expect(res.status).toEqual(404);
    expect(res.body).toMatchObject(expectedResultValue);
});
