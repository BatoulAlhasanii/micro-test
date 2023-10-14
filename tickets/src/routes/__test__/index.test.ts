import {app} from "../../app";
import request from "supertest";

const createTicket = () => {
    const cookie = global.signUp();

    return request(app).post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'ticket title',
            price: 10,
        })

};

it ('test view all tickets', async() => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app).get('/api/tickets')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});