import config from './config';
import { requestWithSupertest } from './config/testing';

it('GET / should return correct message', async () => {
    const res = await requestWithSupertest.get('/api/v1');
    expect(res.text).toEqual(config.messages.welcomeMessage);
});
