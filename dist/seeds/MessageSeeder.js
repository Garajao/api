"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSeeder = void 0;
const Message_1 = require("../entities/Message");
class MessageSeeder {
    async run(dataSource, factoryManager) {
        const messageRepository = dataSource.getRepository(Message_1.Message);
        const messagesData = [{
                id: 1,
                description: 'Opened gate',
            }, {
                id: 2,
                description: 'Closed gate',
            }, {
                id: 3,
                description: 'Loading...',
            }, {
                id: 4,
                description: 'Invalid code',
            }, {
                id: 5,
                description: 'Code out of sequence',
            }, {
                id: 6,
                description: 'Expired code',
            }];
        const newMessage = messageRepository.create(messagesData);
        await messageRepository.save(newMessage);
    }
}
exports.MessageSeeder = MessageSeeder;
