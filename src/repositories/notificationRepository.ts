import { appDataSource } from "../data-source";
import { Notification } from "../entities/Notification";

export const notificationRepository = appDataSource.getRepository(Notification)