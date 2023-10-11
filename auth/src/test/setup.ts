import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose, {Collection} from "mongoose";
import request from "supertest";
import {app} from "../app";


// npm run test:ci -- sign-up.test
//

declare global {
    var signUp: () => Promise<string[]>; //TODO try let
}

let mongo: any;
beforeAll(async (): Promise<void> => {
    process.env.JWT_KEY = 'jwtkey';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    //
    await mongoose.connect(mongoUri, {}); //TODO remove {}
}, 5000000);

beforeEach(async (): Promise<void> => {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({}); //TODO remove {}
    }
});

afterAll(async (): Promise<void> => {
    if (mongo) {
        await mongo.stop();
    }

    await mongoose.connection.close();
});

global.signUp = async (): Promise<string[]> => {
    const email: string = 'user@micro-test.com';
    const password: string = 'password';

    const response = await  request(app)
        .post('/api/users/sign-up')
        .send({ email, password })
        .expect(201);

    return response.get('Set-Cookie');
}