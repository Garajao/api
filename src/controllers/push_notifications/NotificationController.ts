import { Request, Response } from 'express'

import { BadRequestError, NotFoundError } from '../../helpers/api-errors'
import { notificationRepository } from '../../repositories/notificationRepository'
import { deviceRepository } from '../../repositories/deviceRepository'

export class NotificationController {
  /**
   * @swagger
   * /api/notifications:
   *   get:
   *     summary: Get all notifications
   *     tags:
   *       - Notifications
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
   *                 $ref: '#/components/schemas/Notification'
   */
  async list(req: Request, res: Response) {
    const notifications = await notificationRepository.find({
      relations: { device: { user: true } },
      withDeleted: true,
    })

    return res.json(notifications)
  }

  /**
   * @swagger
   * /api/notifications:
   *   post:
   *     summary: Create notification
   *     tags:
   *       - Notifications
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               body:
   *                 type: string
   *               device_id:
   *                 type: string
   *             required:
   *               - title
   *               - body
   *               - device_id
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
    return res.status(201).json({ id: newNotification.id })
  }

  /**
   * @swagger
   * /api/notifications/{idNotification}:
   *   put:
   *     summary: Update notification
   *     tags:
   *       - Notifications
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idNotification
   *         required: true
   *         description: Notification ID
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               body:
   *                 type: string
   *               device_id:
   *                 type: string
   *               expo_id:
   *                 type: string
   *               expo_status:
   *                 type: string
   *               expo_message:
   *                 type: string
   *             required:
   *               - title
   *               - body
   *               - device_id
   *     responses:
   *       204:
   *         description: No content
   */
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

  /**
   * @swagger
   * /api/notifications/{idNotification}:
   *   delete:
   *     summary: Delete notification
   *     tags:
   *       - Notifications
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idNotification
   *         required: true
   *         description: Notification ID
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: No content
   */
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
