"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const api_errors_1 = require("../helpers/api-errors");
const messageRepository_1 = require("../repositories/messageRepository");
class MessageController {
    /**
     * @swagger
     * /api/messages:
     *   get:
     *     summary: Get all messages
     *     tags:
     *       - Messages
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Message'
     */
    async list(req, res) {
        const messages = await messageRepository_1.messageRepository.find();
        return res.json(messages);
    }
    /**
     * @swagger
     * /api/messages:
     *   post:
     *     summary: Create message
     *     tags:
     *       - Messages
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               description:
     *                 type: string
     *             required:
     *               - description
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: number
     */
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
    /**
     * @swagger
     * /api/messages/{idMessage}:
     *   put:
     *     summary: Update message
     *     tags:
     *       - Messages
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idMessage
     *         required: true
     *         schema:
     *           type: number
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               description:
     *                 type: string
     *             required:
     *               - description
     *     responses:
     *       204:
     *         description: No content
     */
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
    /**
     * @swagger
     * /api/messages/{idMessage}:
     *   delete:
     *     summary: Delete a message
     *     tags:
     *       - Messages
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idMessage
     *         required: true
     *         schema:
     *           type: number
     *     responses:
     *       204:
     *         description: No content
     */
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
