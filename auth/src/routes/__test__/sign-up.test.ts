import request from "supertest";
import {app} from "../../app";

it('tests signup', async() => {
    const email: string = 'user@micro-test.com';
    const password: string = 'password';

    const response = await  request(app)
        .post('/api/users/sign-up')
        .send({ email, password })
        .expect(201);

    expect(response.body.email).toEqual(email);
    expect(response.get('Set-Cookie')).toBeDefined();
})

it('tests signup returns bad request when invalid email is entered', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'alskdflaskjfd',
            password: 'password'
        })
        .expect(422);
});

it('tests signup returns bad request when an existing email is entered', async () => {
    const email: string = 'user@micro-test.com';
    const password: string = 'password';

    await request(app)
        .post('/api/users/sign-up')
        .send({ email, password })
        .expect(201);

    await request(app)
        .post('/api/users/sign-up')
        .send({ email, password })
        .expect(400);
});