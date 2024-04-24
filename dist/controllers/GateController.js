"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateController = void 0;
const typeorm_1 = require("typeorm");
const gateRepository_1 = require("../repositories/gateRepository");
const userRepository_1 = require("../repositories/userRepository");
const api_errors_1 = require("../helpers/api-errors");
const solicitationRepository_1 = require("../repositories/solicitationRepository");
const Solicitation_1 = require("../entities/Solicitation");
const messageRepository_1 = require("../repositories/messageRepository");
const PushNotificationController_1 = require("./push_notifications/PushNotificationController");
class GateController {
    /**
     * @swagger
     * /api/gates:
     *   get:
     *     summary: Get all gates
     *     tags:
     *       - Gates
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
     *                 $ref: '#/components/schemas/Gate'
     */
    async list(req, res) {
        const gates = await gateRepository_1.gateRepository.find({ loadRelationIds: true });
        return res.json(gates);
    }
    /**
     * @swagger
     * /api/gates/{idGate}:
     *   get:
     *     summary: Get a gate
     *     tags:
     *       - Gates
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idGate
     *         required: true
     *         schema:
     *           type: string
     *         description: The gate ID
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 provisional_open:
     *                   type: boolean
     */
    async find(req, res) {
        const { idGate } = req.params;
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        if (!gate)
            throw new api_errors_1.NotFoundError('O portão não existe');
        await gateRepository_1.gateRepository.update(idGate, {
            consulted_at: new Date().toISOString(),
        });
        return res.json({ provisional_open: gate === null || gate === void 0 ? void 0 : gate.provisional_open });
    }
    /**
     * @swagger
     * /api/gates/{idUser}/user/:
     *   get:
     *     summary: Get all gates by user
     *     tags:
     *       - Gates
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idUser
     *         required: true
     *         schema:
     *           type: string
     *         description: The user ID
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Gate'
     */
    async filterByUser(req, res) {
        const { idUser } = req.params;
        const user = await userRepository_1.userRepository.findOneBy({ id: idUser });
        if (!user)
            throw new api_errors_1.NotFoundError('O usuário não existe');
        const gates = await gateRepository_1.gateRepository
            .createQueryBuilder('gate')
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
    /**
     * @swagger
     * /api/gates:
     *   post:
     *     summary: Create a new gate
     *     tags:
     *       - Gates
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               cep:
     *                 type: string
     *               address:
     *                 type: string
     *               complement:
     *                 type: string
     *               number:
     *                 type: string
     *               city:
     *                 type: string
     *               uf:
     *                 type: string
     *               image:
     *                 type: string
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     */
    async create(req, res) {
        const { name, cep, address, complement, number, city, uf, image } = req.body;
        if (!name)
            throw new api_errors_1.BadRequestError('O nome é obrigatório');
        if (!cep)
            throw new api_errors_1.BadRequestError('O CEP é obrigatório');
        if (!address)
            throw new api_errors_1.BadRequestError('O endereço é obrigatório');
        if (!number)
            throw new api_errors_1.BadRequestError('O número é obrigatório');
        if (!city)
            throw new api_errors_1.BadRequestError('A cidade é obrigatória');
        if (!uf)
            throw new api_errors_1.BadRequestError('O UF é obrigatório');
        const newGate = gateRepository_1.gateRepository.create({
            name,
            cep,
            address,
            complement,
            number,
            city,
            uf,
            image,
        });
        await gateRepository_1.gateRepository.save(newGate);
        return res.status(201).json({ id: newGate.id });
    }
    /**
     * @swagger
     * /api/gates/{idGate}:
     *   put:
     *     summary: Update gate
     *     tags:
     *       - Gates
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idGate
     *         required: true
     *         schema:
     *           type: string
     *         description: The gate ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               open:
     *                 type: boolean
     *               provisional_open:
     *                 type: boolean
     *               notified:
     *                 type: boolean
     *               cep:
     *                 type: string
     *               address:
     *                 type: string
     *               complement:
     *                 type: string
     *               number:
     *                 type: string
     *               city:
     *                 type: string
     *               uf:
     *                 type: string
     *               image:
     *                 type: string
     *     responses:
     *       204:
     *         description: No content
     */
    async update(req, res) {
        const { name, open, provisional_open, notified, cep, address, complement, number, city, uf, image, } = req.body;
        const { idGate } = req.params;
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        if (!gate)
            throw new api_errors_1.NotFoundError('O portão não existe');
        await gateRepository_1.gateRepository.update(idGate, {
            name,
            open,
            provisional_open,
            notified,
            cep,
            address,
            complement,
            number,
            city,
            uf,
            image,
        });
        return res.status(204).send();
    }
    /**
     * @swagger
     * /api/gates/{idGate}:
     *   delete:
     *     summary: Delete gate
     *     tags:
     *       - Gates
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idGate
     *         required: true
     *         schema:
     *           type: string
     *         description: The gate ID
     *     responses:
     *       204:
     *         description: No content
     */
    async delete(req, res) {
        const { idGate } = req.params;
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        if (!gate)
            throw new api_errors_1.NotFoundError('O portão não existe');
        await gateRepository_1.gateRepository.delete(idGate);
        return res.status(204).send();
    }
    /**
     * @swagger
     * /api/gates/{idGate}/solicitations/valid:
     *   put:
     *     summary: Valid solicitations
     *     tags:
     *       - Gates
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idGate
     *         required: true
     *         schema:
     *           type: string
     *         description: The gate ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             properties:
     *               status:
     *                 type: boolean
     *     responses:
     *       204:
     *         description: No content
     */
    async validSolicitations(req, res) {
        const { status } = req.body;
        const { idGate } = req.params;
        const gate = await gateRepository_1.gateRepository.findOne({
            relations: { users: { devices: true } },
            where: { id: idGate },
        });
        if (!gate)
            throw new api_errors_1.NotFoundError('O portão não existe');
        const solicitations = await solicitationRepository_1.solicitationRepository.find({
            relations: { user: true },
            where: { gate: { id: idGate }, valid: false },
        });
        solicitations.map(async (solicitation) => {
            await solicitationRepository_1.solicitationRepository.update(solicitation.id, {
                valid: true,
                message: status ? 1 : 2,
            });
            const messages = await messageRepository_1.messageRepository.findBy({ id: (0, typeorm_1.In)([1, 2]) });
            const notifications = [];
            gate.users.map(async (user) => {
                var _a;
                if (((_a = solicitation.user) === null || _a === void 0 ? void 0 : _a.id) === user.id)
                    return;
                user.devices.map(async (device) => {
                    var _a;
                    notifications.push({
                        device,
                        title: gate.name,
                        body: `${status ? messages[0].description : messages[1].description} por ${(_a = solicitation.user) === null || _a === void 0 ? void 0 : _a.name}`,
                    });
                });
            });
            new PushNotificationController_1.PushNotificationController().send(notifications);
        });
        await gateRepository_1.gateRepository.update(idGate, {
            open: status,
            provisional_open: status,
            notified: false,
        });
        return res.status(204).send();
    }
    /**
     * @swagger
     * /api/gates/{idGate}/solicitations:
     *   get:
     *     summary: Get solicitations by gate
     *     tags:
     *       - Gates
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idGate
     *         required: true
     *         schema:
     *           type: string
     *         description: The gate ID
     *       - in: query
     *         name: offset
     *         required: false
     *         schema:
     *           type: string
     *         description: The offset
     *       - in: query
     *         name: limit
     *         required: false
     *         schema:
     *           type: string
     *         description: The limit
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Solicitation'
     */
    async paging(req, res) {
        const { idGate } = req.params;
        const { offset, limit } = req.query;
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        if (!gate)
            throw new api_errors_1.NotFoundError('O portão não existe');
        const solicitations = await solicitationRepository_1.solicitationRepository.find({
            relations: { user: true, gate: true, message: true },
            where: { gate: { id: idGate } },
            order: { updated_at: 'DESC' },
            skip: Number(offset),
            take: Number(limit),
        });
        return res.status(200).json(solicitations);
    }
    /**
     * @swagger
     * /api/gates/open:
     *   get:
     *     summary: Check if the gate is open
     *     tags:
     *       - Gates
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       204:
     *         description: No content
     */
    async checkGateIsOpen(req, res) {
        const spreadDateToOnline = new Date();
        spreadDateToOnline.setSeconds(spreadDateToOnline.getSeconds() -
            Number(process.env.TIME_LIMIT_TO_ONLINE));
        const spreadDateToNotify = new Date();
        spreadDateToNotify.setMinutes(spreadDateToNotify.getMinutes() -
            Number(process.env.TIMEOUT_TO_NOTIFY_GATE));
        const gates = await gateRepository_1.gateRepository
            .createQueryBuilder('gate')
            .leftJoinAndMapOne('gate.solicitations', Solicitation_1.Solicitation, 'solicitations', 'solicitations.valid = true and solicitations.gate = gate.id and solicitations.message IN (:...ids)', { ids: [1, 2] })
            .leftJoinAndSelect('gate.users', 'users')
            .leftJoinAndSelect('users.devices', 'devices')
            .where('gate.open = :open', { open: true })
            .andWhere('gate.consulted_at > :date', {
            date: spreadDateToOnline,
        })
            .orderBy('solicitations.updated_at', 'DESC', 'NULLS LAST')
            .getMany();
        const notifications = [];
        gates.map(async (gate) => {
            const solicitation = gate.solicitations;
            if (spreadDateToNotify < solicitation.updated_at)
                return;
            if (gate.notified)
                return;
            gate.users.map(async (user) => {
                user.devices.map(async (device) => {
                    notifications.push({
                        device,
                        title: gate.name,
                        body: `Atenção, o seu portão está aberto a mais de ${process.env.TIMEOUT_TO_NOTIFY_GATE} minuto(s), caso tenha esquecido, acesse o app para fechá-lo!`,
                    });
                });
            });
            await gateRepository_1.gateRepository.update(gate.id, {
                notified: true,
            });
        });
        new PushNotificationController_1.PushNotificationController().send(notifications);
        return res.status(204).send();
    }
}
exports.GateController = GateController;
