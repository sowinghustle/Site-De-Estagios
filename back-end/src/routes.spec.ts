import respMessages from './config/responseMessages';
import { requestWithSupertest } from './utils/testing';

it('GET / should return correct message', async () => {
    const res = await requestWithSupertest.get('/api/v1');
    expect(res.text).toEqual(respMessages.welcome);
});
