import {ProducerRecord, RecordMetadata} from "kafkajs";

export const kafkaWrapper = {
    producer: {
        send: jest
            .fn()
            .mockImplementation((record: ProducerRecord): RecordMetadata[] => {
                return [
                    {
                        topicName: "topicName",
                        partition: 0,
                        errorCode: 0,
                    }
                ];
            }),
    }
}
