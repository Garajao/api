"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitationController = void 0;
const solicitationRepository_1 = require("../repositories/solicitationRepository");
const userRepository_1 = require("../repositories/userRepository");
const gateRepository_1 = require("../repositories/gateRepository");
const api_errors_1 = require("../helpers/api-errors");
class SolicitationController {
    async list(req, res) {
        const solicitations = await solicitationRepository_1.solicitationRepository.find({
            relations: {
                gate: true,
                user: true,
                message: true
            }
        });
        return res.json(solicitations);
    }
    async create(req, res) {
        let { status, method, message, code, valid, user_id } = req.body;
        const { idGate } = req.params;
        const user = await userRepository_1.userRepository.findOneBy({ id: user_id !== null && user_id !== void 0 ? user_id : "00000000-0000-0000-0000-000000000000" });
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        const solicitation = await solicitationRepository_1.solicitationRepository.findOne({
            relations: { gate: true },
            where: { gate: { id: idGate }, valid: false },
        });
        if (!method)
            throw new api_errors_1.BadRequestError('Method is required');
        if (!message)
            throw new api_errors_1.BadRequestError('Message is required');
        if (!gate)
            throw new api_errors_1.NotFoundError('The gate does not exist');
        if (method == "APP") {
            status = !gate.open;
        }
        const newSolicitation = solicitationRepository_1.solicitationRepository.create({
            status, method, message, code, valid, gate, user
        });
        if (!valid) {
            if (solicitation)
                throw new api_errors_1.BadRequestError('There is still a pending request for gate ' + gate.name);
            await gateRepository_1.gateRepository.update(idGate, { provisional_open: status });
        }
        else
            await gateRepository_1.gateRepository.update(idGate, { open: status, provisional_open: status });
        await solicitationRepository_1.solicitationRepository.save(newSolicitation);
        return res.status(201).json({ id: newSolicitation.id });
    }
    async update(req, res) {
        const { status, method, message, code, valid } = req.body;
        const { idSolicitation } = req.params;
        const solicitation = await solicitationRepository_1.solicitationRepository.findOneBy({ id: idSolicitation });
        if (!solicitation)
            throw new api_errors_1.NotFoundError('The solicitation does not exist');
        await solicitationRepository_1.solicitationRepository.update(idSolicitation, {
            status, method, message, code, valid
        });
        return res.status(204).send();
    }
    async delete(req, res) {
        const { idSolicitation } = req.params;
        const solicitation = await solicitationRepository_1.solicitationRepository.findOneBy({ id: idSolicitation });
        if (!solicitation)
            throw new api_errors_1.NotFoundError('The solicitation does not exist');
        await solicitationRepository_1.solicitationRepository.delete(idSolicitation);
        return res.status(204).send();
    }
}
exports.SolicitationController = SolicitationController;
