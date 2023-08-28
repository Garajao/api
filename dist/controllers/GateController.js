"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateController = void 0;
const gateRepository_1 = require("../repositories/gateRepository");
const userRepository_1 = require("../repositories/userRepository");
const api_errors_1 = require("../helpers/api-errors");
const solicitationRepository_1 = require("../repositories/solicitationRepository");
const Solicitation_1 = require("../entities/Solicitation");
const messageRepository_1 = require("../repositories/messageRepository");
const typeorm_1 = require("typeorm");
const PushNotificationController_1 = require("./push_notifications/PushNotificationController");
class GateController {
    async list(req, res) {
        const gates = await gateRepository_1.gateRepository.find({ loadRelationIds: true });
        return res.json(gates);
    }
    async find(req, res) {
        const { idGate } = req.params;
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        if (!gate)
            throw new api_errors_1.NotFoundError('The gate does not exist');
        await gateRepository_1.gateRepository.update(idGate, {
            consulted_at: new Date().toISOString()
        });
        return res.json({ provisional_open: gate === null || gate === void 0 ? void 0 : gate.provisional_open });
    }
    async filterByUser(req, res) {
        const { idUser } = req.params;
        const user = await userRepository_1.userRepository.findOneBy({ id: idUser });
        if (!user)
            throw new api_errors_1.NotFoundError('The user does not exist');
        const gates = await gateRepository_1.gateRepository.createQueryBuilder('gate')
            .withDeleted()
            .leftJoinAndMapOne('gate.solicitations', Solicitation_1.Solicitation, 'solicitations', 'solicitations.valid = true and solicitations.gate = gate.id and solicitations.message IN (:...ids)', { ids: [1, 2] })
            .leftJoin('gate.users', 'user')
            .leftJoinAndSelect('gate.users', 'users')
            .leftJoinAndSelect('users.role', 'role')
            .leftJoinAndSelect('users.devices', 'devices')
            .leftJoinAndSelect('solicitations.message', 'message')
            .where('user.id = :id', { id: idUser })
            .orderBy('solicitations.updated_at', 'DESC', 'NULLS LAST')
            .addOrderBy('gate.consulted_at', 'DESC')
            .addOrderBy('gate.name', 'ASC')
            .addOrderBy('role.level', 'ASC')
            .addOrderBy('users.name', 'ASC')
            .getMany();
        return res.json(gates);
    }
    async create(req, res) {
        const { name, cep, address, complement, number, city, uf, image } = req.body;
        if (!name)
            throw new api_errors_1.BadRequestError('Name is required');
        if (!cep)
            throw new api_errors_1.BadRequestError('CEP is required');
        if (!address)
            throw new api_errors_1.BadRequestError('Address is required');
        if (!number)
            throw new api_errors_1.BadRequestError('Number is required');
        if (!city)
            throw new api_errors_1.BadRequestError('City is required');
        if (!uf)
            throw new api_errors_1.BadRequestError('UF is required');
        const newGate = gateRepository_1.gateRepository.create({
            name, cep, address, complement, number, city, uf, image
        });
        await gateRepository_1.gateRepository.save(newGate);
        return res.status(201).json({ id: newGate.id });
    }
    async update(req, res) {
        const { name, open, provisional_open, cep, address, complement, number, city, uf, image } = req.body;
        const { idGate } = req.params;
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        if (!gate)
            throw new api_errors_1.NotFoundError('The gate does not exist');
        await gateRepository_1.gateRepository.update(idGate, {
            name, open, provisional_open, cep, address, complement, number, city, uf, image
        });
        return res.status(204).send();
    }
    async delete(req, res) {
        const { idGate } = req.params;
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        if (!gate)
            throw new api_errors_1.NotFoundError('The gate does not exist');
        await gateRepository_1.gateRepository.delete(idGate);
        return res.status(204).send();
    }
    async validSolicitations(req, res) {
        const { status } = req.body;
        const { idGate } = req.params;
        const gate = await gateRepository_1.gateRepository.findOne({
            relations: { users: { devices: true } },
            where: { id: idGate }
        });
        if (!gate)
            throw new api_errors_1.NotFoundError('The gate does not exist');
        const solicitations = await solicitationRepository_1.solicitationRepository.find({
            relations: { user: true },
            where: { gate: { id: idGate }, valid: false }
        });
        solicitations.map(async (solicitation) => {
            await solicitationRepository_1.solicitationRepository.update(solicitation.id, { valid: true, message: status ? 1 : 2 });
            const messages = await messageRepository_1.messageRepository.findBy({ id: (0, typeorm_1.In)([1, 2]) });
            const notifications = [];
            gate.users.map(async (user) => {
                var _a;
                if (((_a = solicitation.user) === null || _a === void 0 ? void 0 : _a.id) != user.id) {
                    user.devices.map(async (device) => {
                        var _a;
                        notifications.push({
                            device: device,
                            title: gate.name,
                            body: `${status ? messages[0].description : messages[1].description} by ${(_a = solicitation.user) === null || _a === void 0 ? void 0 : _a.name}`
                        });
                    });
                }
            });
            new PushNotificationController_1.PushNotificationController().send(notifications);
        });
        await gateRepository_1.gateRepository.update(idGate, { open: status, provisional_open: status });
        return res.status(204).send();
    }
    async paging(req, res) {
        const { idGate } = req.params;
        const { offset, limit } = req.query;
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        if (!gate)
            throw new api_errors_1.NotFoundError('The gate does not exist');
        const solicitations = await solicitationRepository_1.solicitationRepository.find({
            relations: { user: true, gate: true, message: true },
            where: { gate: { id: idGate } },
            order: { updated_at: 'DESC', }, skip: Number(offset), take: Number(limit)
        });
        return res.json(solicitations);
    }
}
exports.GateController = GateController;
