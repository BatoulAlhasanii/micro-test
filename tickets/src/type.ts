enum Subjects {
    Event1 = 'event1',
    Event2 = 'event2',
    // Add more event types here
}

interface EventDataMap {
    [Subjects.Event1]: { prop1: string };
    [Subjects.Event2]: { prop2: number };
    // Add more event data types here
}

// Define the base event interface
interface Event<T extends Subjects> {
    subject: T;
    data: EventDataMap[T];
}

// Define event handlers for each event type
class Event1Handler<T extends Subjects> {
    handle(event: Event<Subjects.Event1>): void {
        console.log(`Handling Event1: ${event.data.prop1}`);
    }
}

class Event2Handler {
    handle(event: Event<Subjects.Event2>): void {
        console.log(`Handling Event2: ${event.data.prop2}`);
    }
}

const eventHandlerRegistry: Record<Subjects, new () => any> = {
    [Subjects.Event1]: Event1Handler,
    [Subjects.Event2]: Event2Handler,
};

function createEventHandler<T extends Subjects>(eventName: T): any {
    const HandlerClass = eventHandlerRegistry[eventName];
    if (HandlerClass) {
        return new HandlerClass();
    } else {
        throw new Error(`No handler found for event: ${eventName}`);
    }
}

// Example usage:
const event1Data: EventDataMap[Subjects.Event1] = { prop1: 'Value for Event1' };
const event1: Event<Subjects.Event1> = { subject: Subjects.Event1, data: event1Data };
const eventHandler1 = createEventHandler(event1.subject);
eventHandler1.handle(event1); // Output: Handling Event1: Value for Event1

const event2Data: EventDataMap[Subjects.Event2] = { prop2: 42 };
const event2: Event<Subjects.Event2> = { subject: Subjects.Event2, data: event2Data };
const eventHandler2 = createEventHandler(event2.subject);
eventHandler2.handle(event2); // Output: Handling Event2: 42