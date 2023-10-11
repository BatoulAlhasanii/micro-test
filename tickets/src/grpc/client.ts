import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ServiceClientConstructor, GrpcObject, ServiceDefinition } from '@grpc/grpc-js/build/src/make-client';
import path from 'path';

// const packageDef = protoLoader.loadSync('./todo.proto', {});
// const grpcObject = grpc.loadPackageDefinition(packageDef);
// const todoService = grpcObject.TodoService;

const options: protoLoader.Options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};


const packageDefinition = protoLoader.loadSync(__dirname +'/todo.proto', options);

const grpcObj: GrpcObject = grpc.loadPackageDefinition(packageDefinition);

const services = grpcObj['todoPackage'] as GrpcObject;

const constructor = services['TodoService'] as ServiceClientConstructor;
export const client = new constructor("tickets-srv:50051",
    grpc.credentials.createInsecure());
//
// client.createTodo({
//    id: -1,
//    text: "todo"
// }, (err, response) => {
//     console.log("Recieved from server " + JSON.stringify(response))
// });
//
// client.readTodos(null, (err, response) => {
//
//     console.log("read the todos from server " + JSON.stringify(response))
//     if (!response.items)
//         response.items.forEach(a=>console.log(a.text));
// });
//
// const call = client.readTodosStream();
// call.on("data", item => {
//     console.log("received item from server " + JSON.stringify(item))
// });
//
// call.on("end", e => console.log("server done!"));