import { Request, Response } from 'express'

import { BadRequestError, NotFoundError } from '../../helpers/api-errors'
import { notificationRepository } from '../../repositories/notificationRepository'
import { deviceRepository } from '../../repositories/deviceRepository'

export class NotificationController {
  async list(req: Request, res: Response) {
    const notifications = await notificationRepository.find({
      relations: { device: { user: true } },
      withDeleted: true,
    })

    return res.json(notifications)
  }

  async create(req: Request, res: Response) {
    const { title, body, device_id } = req.body

    if (!title)
      throw new BadRequestError('O título da notificação é obrigatório')

    if (!body) throw new BadRequestError('O corpo da notificação é obrigatório')

    const device = await deviceRepository.findOneBy({ id: device_id })

    if (!device) throw new BadRequestError('O aparelho não existe')

    const newNotification = notificationRepository.create({
      title,
      body,
      device,
    })

    await notificationRepository.save(newNotification)
    return res.status(201).json(newNotification.id)
  }

  async update(req: Request, res: Response) {
    const { title, body, device_id, expo_id, expo_status, expo_message } =
      req.body
    const { idNotification } = req.params

    const notification = await notificationRepository.findOneBy({
      id: idNotification,
    })

    if (!notification) throw new NotFoundError('A notificação não existe')

    const device = await deviceRepository.findOneBy({ id: device_id })

    if (!device) throw new BadRequestError('O apareho não existe')

    await notificationRepository.update(idNotification, {
      title,
      body,
      device,
      expo_id,
      expo_status,
      expo_message,
    })

    return res.status(204).send()
  }

  async delete(req: Request, res: Response) {
    const { idNotification } = req.params

    const notification = await notificationRepository.findOneBy({
      id: idNotification,
    })

    if (!notification) throw new NotFoundError('A notificação não existe')

    await notificationRepository.delete(idNotification)

    return res.status(204).send()
  }
}
