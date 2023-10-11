import request from "supertest";
import {app} from "../../app";

it ('test sign in', async (): Promise<void> => {

    const email: string = 'user@micro-test.com';
    const password: string = 'password';

    await request(app)
        .post('/api/users/sign-up')
        .send({email, password})
        .expect(201);

    const response = request(app)
        .post('/api/users/sign-in')
        .send({email, password})
        .expect(200);
});

it ('test sign in returns bad request when email does not exist', async (): Promise<void> => {

    const email: string = 'user@micro-test.com';
    const password: string = 'password';

    await request(app)
        .post('/api/users/sign-up')
        .send({email, password})
        .expect(201);

    const response = request(app)
        .post('/api/users/sign-in')
        .send({email: 'user1@micro-test.com', password})
        .expect(400);
});

it ('test sign in returns bad request when password is wrong', async (): Promise<void> => {
    const email: string = 'user@micro-test.com';
    const password: string = 'password';

    await request(app)
        .post('/api/users/sign-up')
        .send({email, password})
        .expect(201);

    const response = request(app)
        .post('/api/users/sign-in')
        .send({email, password: 'something'})
        .expect(400);
});