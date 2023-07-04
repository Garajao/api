"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateController = void 0;
const gateRepository_1 = require("../repositories/gateRepository");
const userRepository_1 = require("../repositories/userRepository");
const api_errors_1 = require("../helpers/api-errors");
const solicitationRepository_1 = require("../repositories/solicitationRepository");
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
        const gates = await gateRepository_1.gateRepository.findOne({
            where: { id: idGate }
        });
        return res.json({ provisional_open: gates === null || gates === void 0 ? void 0 : gates.provisional_open });
    }
    async filterByUser(req, res) {
        const { idUser } = req.params;
        const user = await userRepository_1.userRepository.findOneBy({ id: idUser });
        if (!user)
            throw new api_errors_1.NotFoundError('The user does not exist');
        const gates = await gateRepository_1.gateRepository.find({
            where: { users: { id: idUser } }
        });
        return res.json(gates);
    }
    async create(req, res) {
        const { name, cep, address, complement, number, city, uf } = req.body;
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
            name, cep, address, complement, number, city, uf
        });
        await gateRepository_1.gateRepository.save(newGate);
        return res.status(201).json({ id: newGate.id });
    }
    async update(req, res) {
        const { name, open, provisional_open, cep, address, complement, number, city, uf } = req.body;
        const { idGate } = req.params;
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        if (!gate)
            throw new api_errors_1.NotFoundError('The gate does not exist');
        await gateRepository_1.gateRepository.update(idGate, {
            name, open, provisional_open, cep, address, complement, number, city, uf
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
    async paging(req, res) {
        const { idGate } = req.params;
        const { offset, limit } = req.query;
        const gate = await gateRepository_1.gateRepository.findOneBy({ id: idGate });
        if (!gate)
            throw new api_errors_1.NotFoundError('The gate does not exist');
        const solicitations = await solicitationRepository_1.solicitationRepository.find({
            relations: { user: true, gate: true },
            where: { gate: { id: idGate } },
            order: { updated_at: 'DESC', }, skip: Number(offset), take: Number(limit)
        });
        return res.json(solicitations);
    }
}
exports.GateController = GateController;
