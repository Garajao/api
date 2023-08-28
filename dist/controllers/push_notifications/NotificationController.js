"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const api_errors_1 = require("../../helpers/api-errors");
const notificationRepository_1 = require("../../repositories/notificationRepository");
const deviceRepository_1 = require("../../repositories/deviceRepository");
class NotificationController {
    async list(req, res) {
        const notifications = await notificationRepository_1.notificationRepository.find({
            relations: { device: { user: true } },
            withDeleted: true
        });
        return res.json(notifications);
    }
    async create(req, res) {
        const { title, body, device_id } = req.body;
        if (!title)
            throw new api_errors_1.BadRequestError('Title is required');
        if (!body)
            throw new api_errors_1.BadRequestError('Body is required');
        const device = await deviceRepository_1.deviceRepository.findOneBy({ id: device_id });
        if (!device)
            throw new api_errors_1.BadRequestError('The device does not exist');
        const newNotification = notificationRepository_1.notificationRepository.create({
            title, body, device
        });
        await notificationRepository_1.notificationRepository.save(newNotification);
        return res.status(201).json(newNotification.id);
    }
    async update(req, res) {
        const { title, body, device_id, expo_id, expo_status, expo_message } = req.body;
        const { idNotification } = req.params;
        const notification = await notificationRepository_1.notificationRepository.findOneBy({ id: idNotification });
        if (!notification)
            throw new api_errors_1.NotFoundError('The notification does not exist');
        const device = await deviceRepository_1.deviceRepository.findOneBy({ id: device_id });
        if (!device)
            throw new api_errors_1.BadRequestError('The device does not exist');
        await notificationRepository_1.notificationRepository.update(idNotification, {
            title, body, device, expo_id, expo_status, expo_message
        });
        return res.status(204).send();
    }
    async delete(req, res) {
        const { idNotification } = req.params;
        const notification = await notificationRepository_1.notificationRepository.findOneBy({ id: idNotification });
        if (!notification)
            throw new api_errors_1.NotFoundError('The notification does not exist');
        await notificationRepository_1.notificationRepository.delete(idNotification);
        return res.status(204).send();
    }
}
exports.NotificationController = NotificationController;
