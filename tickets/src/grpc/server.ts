import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ServiceClientConstructor, GrpcObject, ServiceDefinition } from '@grpc/grpc-js/build/src/make-client';
import path from 'path';

const options: protoLoader.Options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const server = new grpc.Server();


server.bindAsync("0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.log(err)
        }
        server.start();
        console.log(`listening on port ${port}`)
    });


// const packageDef = protoLoader.loadSync(__dirname + '/todo.proto', options);
// const grpcObject = grpc.loadPackageDefinition(packageDef) ;
// const todoPackage = grpcObject.todoPackage;
//
// console.log("todoPackage", todoPackage, typeof  todoPackage);
//
//
// server.addService(todoPackage.TodoService.service,
//     {
//         "createTodo": createTodo,
//         "readTodos": readTodos,
//         "readTodosStream": readTodosStream
//     }
// );


const PROTO_PATH = path.resolve(__dirname, '/todo.proto');
const packageDefinition = protoLoader.loadSync(__dirname +'/todo.proto', options);

const grpcObj: GrpcObject = grpc.loadPackageDefinition(packageDefinition);

const services = grpcObj['todoPackage'] as GrpcObject;

const constructor = services['TodoService'] as ServiceClientConstructor;

const { service } = constructor;

server.addService(service,
    {
        "createTodo": createTodo,
        "readTodos": readTodos,
        "readTodosStream": readTodosStream
    }
);

export interface TodoItem {
    id: number,
    text: string;
}

const todos: TodoItem[] = [];

function createTodo(call: any, callback: any) {
    const todoItem: TodoItem = {
        id: todos.length + 1,
        text: call.request.text
    }

    todos.push(todoItem);
    callback(null, todoItem);
}

function readTodos(call: any, callback: any) {
    callback(null, {items: todos});
}

function readTodosStream(call: any, callback: any) {
    todos.forEach((t: TodoItem) => call.write(t))
    call.end();
}