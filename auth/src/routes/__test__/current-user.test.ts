import request from "supertest";
import {app} from "../../app";

it('tests current user', async (): Promise<void> => {
    const cookie = await global.signUp();

    const response = await request(app)
        .get('/api/users/current-user')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual('user@micro-test.com')
})

it('tests current user return null', async () => {
    const response = await  request(app)
        .get('/api/users/current-user')
        .send()
        .expect(200);

    expect(response.body.currentUser).toEqual(null);
})