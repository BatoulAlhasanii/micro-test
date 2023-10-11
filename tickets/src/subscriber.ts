// import {Consumer, EachMessagePayload} from "kafkajs";
//
// enum Subjects {
//     YourTopic = 'your_topic',
//     TicketCreated = 'ticket:created',
//     TicketUpdated = 'ticket:updated',
// }
//
// export interface EventDataMap {
//     [Subjects.YourTopic]: string;
//     [Subjects.TicketCreated]: {
//         id: string;
//         version: number;
//         title: string;
//         price: number;
//         userId: string;
//     };
//     [Subjects.TicketUpdated]: string;
// }
//
// export interface EventHandlerMap {
//     [Subjects.YourTopic]: BaseEventHandler<Subjects.YourTopic>;
//     [Subjects.TicketCreated]: BaseEventHandler<Subjects.TicketCreated>;
// }
//
// interface BaseEventHandler<T extends Subjects> {
//     handle(data: EventDataMap[T]);
// }
//
// class YourTopicHandler implements BaseEventHandler<Subjects.YourTopic> {
//     async handle(data: EventDataMap[Subjects.YourTopic]) {
//
//     }
// }
//
// class TicketCreatedHandler implements BaseEventHandler<Subjects.TicketCreated> {
//     async handle(data: EventDataMap[Subjects.TicketCreated]) {
//
//     }
// }
//
// const eventHandlerMap: EventHandlerMap = {
//     [Subjects.TicketCreated]: TicketCreatedHandler,
//     [Subjects.YourTopic]: YourTopicHandler,
// }
//
// const yourTopicHandler: YourTopicHandler = new YourTopicHandler();