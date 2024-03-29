import request from 'supertest';
import { app } from '../../app';

it('tests sign out', async () => {
    const cookie = await global.signUp();

    const response = await request(app)
        .post('/api/users/sign-out')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response.get('Set-Cookie')[0]).toEqual(
        'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
});
