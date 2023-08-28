"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const api_errors_1 = require("../helpers/api-errors");
const messageRepository_1 = require("../repositories/messageRepository");
class MessageController {
    async list(req, res) {
        const messages = await messageRepository_1.messageRepository.find();
        return res.json(messages);
    }
    async create(req, res) {
        const { description } = req.body;
        if (!description)
            throw new api_errors_1.BadRequestError('A descrição é obrigatória');
        const newMessage = messageRepository_1.messageRepository.create({
            description,
        });
        await messageRepository_1.messageRepository.save(newMessage);
        // return res.status(201).json({ id: newMessage.id })
        return res.status(201).json(newMessage);
    }
    async update(req, res) {
        const { description } = req.body;
        const { idMessage } = req.params;
        const message = await messageRepository_1.messageRepository.findOneBy({ id: Number(idMessage) });
        if (!message)
            throw new api_errors_1.NotFoundError('A mensagem não existe');
        await messageRepository_1.messageRepository.update(idMessage, {
            description,
        });
        return res.status(204).send();
    }
    async delete(req, res) {
        const { idMessage } = req.params;
        const message = await messageRepository_1.messageRepository.findOneBy({ id: Number(idMessage) });
        if (!message)
            throw new api_errors_1.NotFoundError('A mensagem não existe');
        await messageRepository_1.messageRepository.delete(idMessage);
        return res.status(204).send();
    }
}
exports.MessageController = MessageController;
