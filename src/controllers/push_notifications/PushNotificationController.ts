import Expo, { ExpoPushMessage } from 'expo-server-sdk'

import { notificationRepository } from '../../repositories/notificationRepository'
import { Notification } from '../../entities/Notification'

export class PushNotificationController {
  async send(notifications: Notification[]) {
    const notificationsWithId = await Promise.all(
      notifications.map(async (notification) => {
        const newNotification = notificationRepository.create({
          title: notification.title,
          body: notification.body,
          device: notification.device,
        })
        const createdNotification =
          await notificationRepository.save(newNotification)

        return { ...notification, id: createdNotification.id }
      }),
    )

    try {
      const expo = new Expo()
      const ticket = await expo.sendPushNotificationsAsync(
        notificationsWithId.map((notification) => {
          return {
            to: notification.device.push_token,
            title: notification.title,
            body: notification.body,
          } as ExpoPushMessage
        }),
      )

      ticket.map(async (expo: any, key) => {
        await notificationRepository.update(notificationsWithId[key].id, {
          expo_id: expo.id,
          expo_status: expo.status,
          expo_message: expo.message,
        })
      })
    } catch (error) {
      console.log(error)
    }
  }
}
