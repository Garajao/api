"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceController = void 0;
const api_errors_1 = require("../helpers/api-errors");
const deviceRepository_1 = require("../repositories/deviceRepository");
class DeviceController {
    async list(req, res) {
        const devices = await deviceRepository_1.deviceRepository.find({
            relations: { user: true, notifications: true },
        });
        return res.status(200).json(devices);
    }
    async filterByPushToken(req, res) {
        const { pushToken } = req.params;
        if (!pushToken)
            throw new api_errors_1.BadRequestError('Push token is required');
        const devices = await deviceRepository_1.deviceRepository.find({
            relations: { user: true },
            where: { push_token: pushToken },
            withDeleted: true,
        });
        if (devices.length === 0)
            throw new api_errors_1.NotFoundError('The device does not exist');
        return res.status(200).json(devices);
    }
    async create(req, res) {
        const { os, model, name, push_token, user } = req.body;
        if (!os)
            throw new api_errors_1.BadRequestError('OS is required');
        if (!model)
            throw new api_errors_1.BadRequestError('Model is required');
        if (!push_token)
            throw new api_errors_1.BadRequestError('Push token is required');
        if (!user)
            throw new api_errors_1.BadRequestError('User is required');
        const newDevice = deviceRepository_1.deviceRepository.create({
            os,
            model,
            name,
            push_token,
            user,
        });
        await deviceRepository_1.deviceRepository.save(newDevice);
        return res.status(201).json(newDevice);
    }
    async update(req, res) {
        const { os, model, name, push_token, user } = req.body;
        const { idDevice } = req.params;
        const device = await deviceRepository_1.deviceRepository.findOneBy({ id: idDevice });
        if (!device)
            throw new api_errors_1.NotFoundError('The device does not exist');
        await deviceRepository_1.deviceRepository.update(idDevice, {
            os,
            model,
            name,
            push_token,
            user,
        });
        return res.status(204).send();
    }
    async delete(req, res) {
        const { idDevice } = req.params;
        const device = await deviceRepository_1.deviceRepository.findOneBy({ id: idDevice });
        if (!device)
            throw new api_errors_1.NotFoundError('The device does not exist');
        await deviceRepository_1.deviceRepository
            .createQueryBuilder()
            .softDelete()
            .where('id = :id', { id: idDevice })
            .execute();
        return res.status(204).send();
    }
    async restore(req, res) {
        const { idDevice } = req.params;
        if (!idDevice)
            throw new api_errors_1.BadRequestError('Device is required');
        const device = await deviceRepository_1.deviceRepository.findOne({
            where: { id: idDevice },
            withDeleted: true,
        });
        if (!device)
            throw new api_errors_1.NotFoundError('The device does not exist');
        await deviceRepository_1.deviceRepository
            .createQueryBuilder()
            .restore()
            .where('id = :id', { id: idDevice })
            .execute();
        return res.status(204).send();
    }
}
exports.DeviceController = DeviceController;
