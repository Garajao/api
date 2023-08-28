"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationController = void 0;
const expo_server_sdk_1 = __importDefault(require("expo-server-sdk"));
const notificationRepository_1 = require("../../repositories/notificationRepository");
class PushNotificationController {
    async send(notifications) {
        const notificationsWithId = await Promise.all(notifications.map(async (notification) => {
            const newNotification = notificationRepository_1.notificationRepository.create({
                title: notification.title,
                body: notification.body,
                device: notification.device,
            });
            const createdNotification = await notificationRepository_1.notificationRepository.save(newNotification);
            return { ...notification, id: createdNotification.id };
        }));
        try {
            const expo = new expo_server_sdk_1.default();
            const ticket = await expo.sendPushNotificationsAsync(notificationsWithId.map((notification) => {
                return {
                    to: notification.device.push_token,
                    title: notification.title,
                    body: notification.body,
                };
            }));
            ticket.map(async (expo, key) => {
                await notificationRepository_1.notificationRepository.update(notificationsWithId[key].id, {
                    expo_id: expo.id,
                    expo_status: expo.status,
                    expo_message: expo.message,
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.PushNotificationController = PushNotificationController;
