"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitationController = void 0;
const typeorm_1 = require("typeorm");
const solicitationRepository_1 = require("../repositories/solicitationRepository");
const userRepository_1 = require("../repositories/userRepository");
const gateRepository_1 = require("../repositories/gateRepository");
const api_errors_1 = require("../helpers/api-errors");
const messageRepository_1 = require("../repositories/messageRepository");
const PushNotificationController_1 = require("./push_notifications/PushNotificationController");
class SolicitationController {
    async list(req, res) {
        const solicitations = await solicitationRepository_1.solicitationRepository.find({
            relations: {
                gate: true,
                user: true,
                message: true,
            },
        });
        return res.json(solicitations);
    }
    async create(req, res) {
        let { status, message, code, valid, user_id } = req.body;
        const { idGate } = req.params;
        const user = await userRepository_1.userRepository.findOneBy({
            id: user_id !== null && user_id !== void 0 ? user_id : '00000000-0000-0000-0000-000000000000',
        });
        const gate = await gateRepository_1.gateRepository.findOne({
            relations: { users: { devices: true } },
            where: { id: idGate },
        });
        const solicitation = await solicitationRepository_1.solicitationRepository.findOne({
            relations: { gate: true },
            where: { gate: { id: idGate }, valid: false },
        });
        if (!message)
            throw new api_errors_1.BadRequestError('A mensagem é obrigatória');
        if (!gate)
            throw new api_errors_1.NotFoundError('O portão não existe');
        if (!code) {
            status = !gate.open;
        }
        const newSolicitation = solicitationRepository_1.solicitationRepository.create({
            status,
            message,
            code,
            valid,
            gate,
            user,
        });
        if (!valid) {
            if (solicitation)
                throw new api_errors_1.BadRequestError(`Ainda existe uma solicitação pendente para o portão ${gate.name}`);
            await gateRepository_1.gateRepository.update(idGate, { provisional_open: status });
        }
        else {
            await gateRepository_1.gateRepository.update(idGate, {
                open: status,
                provisional_open: status,
            });
            const messages = await messageRepository_1.messageRepository.findBy({ id: (0, typeorm_1.In)([1, 2]) });
            const notifications = [];
            gate.users.map(async (user) => {
                user.devices.map(async (device) => {
                    notifications.push({
                        device,
                        title: gate.name,
                        body: `${status ? messages[0].description : messages[1].description} pelo controle`,
                    });
                });
            });
            new PushNotificationController_1.PushNotificationController().send(notifications);
        }
        await solicitationRepository_1.solicitationRepository.save(newSolicitation);
        return res.status(201).json({ id: newSolicitation.id });
    }
    async update(req, res) {
        const { status, message, code, valid } = req.body;
        const { idSolicitation } = req.params;
        const solicitation = await solicitationRepository_1.solicitationRepository.findOneBy({
            id: idSolicitation,
        });
        if (!solicitation)
            throw new api_errors_1.NotFoundError('A solicitação não existe');
        await solicitationRepository_1.solicitationRepository.update(idSolicitation, {
            status,
            message,
            code,
            valid,
        });
        return res.status(204).send();
    }
    async delete(req, res) {
        const { idSolicitation } = req.params;
        const solicitation = await solicitationRepository_1.solicitationRepository.findOneBy({
            id: idSolicitation,
        });
        if (!solicitation)
            throw new api_errors_1.NotFoundError('A solicitação não existe');
        if (solicitation.valid)
            throw new api_errors_1.NotFoundError('Uma solicitação válida não pode ser excluída');
        await solicitationRepository_1.solicitationRepository.delete(idSolicitation);
        return res.status(204).send();
    }
}
exports.SolicitationController = SolicitationController;
