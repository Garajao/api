import { Request, Response } from 'express'

import { BadRequestError, NotFoundError } from '../helpers/api-errors'
import { deviceRepository } from '../repositories/deviceRepository'

export class DeviceController {
  /**
   * @swagger
   * /api/devices:
   *   get:
   *     summary: Get all devices
   *     tags:
   *       - Devices
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
   *                 $ref: '#/components/schemas/Device'
   */
  async list(req: Request, res: Response) {
    const devices = await deviceRepository.find({
      relations: { user: true, notifications: true },
    })

    return res.status(200).json(devices)
  }

  /**
   * @swagger
   * /api/devices/pushToken/{pushToken}:
   *   get:
   *     summary: Filter devices by push token
   *     tags:
   *       - Devices
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pushToken
   *         required: true
   *         description: Push token
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Device'
   */
  async filterByPushToken(req: Request, res: Response) {
    const { pushToken } = req.params

    if (!pushToken)
      throw new BadRequestError('O token de notificação é obrigatório')

    const devices = await deviceRepository.find({
      relations: { user: true },
      where: { push_token: pushToken },
      withDeleted: true,
    })

    if (devices.length === 0) throw new NotFoundError('O aparelho não existe')

    return res.status(200).json(devices)
  }

  /**
   * @swagger
   * /api/devices:
   *   post:
   *     summary: Create device
   *     tags:
   *       - Devices
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               os:
   *                 type: string
   *               model:
   *                 type: string
   *               name:
   *                 type: string
   *               push_token:
   *                 type: string
   *               user:
   *                 type: string
   *             required:
   *               - os
   *               - model
   *               - push_token
   *               - user
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Device'
   */
  async create(req: Request, res: Response) {
    const { os, model, name, push_token, user } = req.body

    if (!os) throw new BadRequestError('O sistema operacional é obrigatório')

    if (!model) throw new BadRequestError('O modelo é obrigatório')

    if (!push_token)
      throw new BadRequestError('O token de notificação é obrigatório')

    if (!user) throw new BadRequestError('O usuário é obrigatório')

    const newDevice = deviceRepository.create({
      os,
      model,
      name,
      push_token,
      user,
    })

    await deviceRepository.save(newDevice)
    return res.status(201).json(newDevice)
  }

  /**
   * @swagger
   * /api/devices/{idDevice}:
   *   put:
   *     summary: Update device
   *     tags:
   *       - Devices
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idDevice
   *         required: true
   *         description: Device ID
   *         schema:
   *           type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               os:
   *                 type: string
   *               model:
   *                 type: string
   *               name:
   *                 type: string
   *               push_token:
   *                 type: string
   *               user:
   *                 type: string
   *             required:
   *               - os
   *               - model
   *               - push_token
   *               - user
   *     responses:
   *       204:
   *         description: No content
   */
  async update(req: Request, res: Response) {
    const { os, model, name, push_token, user } = req.body
    const { idDevice } = req.params

    const device = await deviceRepository.findOneBy({ id: idDevice })

    if (!device) throw new NotFoundError('O aparelho não existe')

    await deviceRepository.update(idDevice, {
      os,
      model,
      name,
      push_token,
      user,
    })

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/devices/{idDevice}:
   *   delete:
   *     summary: Delete device
   *     tags:
   *       - Devices
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idDevice
   *         required: true
   *         description: Device ID
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: No content
   */
  async delete(req: Request, res: Response) {
    const { idDevice } = req.params

    const device = await deviceRepository.findOneBy({ id: idDevice })

    if (!device) throw new NotFoundError('O aparelho não existe')

    await deviceRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id: idDevice })
      .execute()

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/devices/{idDevice}/restore:
   *   put:
   *     summary: Restore device
   *     tags:
   *       - Devices
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idDevice
   *         required: true
   *         description: Device ID
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: No content
   */
  async restore(req: Request, res: Response) {
    const { idDevice } = req.params

    if (!idDevice) throw new BadRequestError('O aparelho é obrigatório')

    const device = await deviceRepository.findOne({
      where: { id: idDevice },
      withDeleted: true,
    })

    if (!device) throw new NotFoundError('O aparelho não existe')

    await deviceRepository
      .createQueryBuilder()
      .restore()
      .where('id = :id', { id: idDevice })
      .execute()

    return res.status(204).send()
  }
}
