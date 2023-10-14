import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose, {Collection} from "mongoose";
import jwt from "jsonwebtoken";

// npm run test:ci -- sign-up.test
//

declare global {
    var signUp: () => string[]; //TODO try let
}

jest.mock('../events/kafka-wrapper');

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
    jest.clearAllMocks();

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

global.signUp = (): string[] => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'user@micro-test.com'
    };

    const token: string = jwt.sign(payload, 'jwt-key');

    const session: {jwt: string} = { jwt: token };

    const sessionJson: string = JSON.stringify(session);

    const base64: string = Buffer.from(sessionJson).toString('base64');

    return [`session=${base64}`];
}