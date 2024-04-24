import { Request, Response } from 'express'

import { solicitationRepository } from '../repositories/solicitationRepository'
import { userRepository } from '../repositories/userRepository'
import { gateRepository } from '../repositories/gateRepository'
import { BadRequestError, NotFoundError } from '../helpers/api-errors'
import { messageRepository } from '../repositories/messageRepository'
import { PushNotificationController } from './push_notifications/PushNotificationController'
import { Notification } from '../entities/Notification'

export class SolicitationController {
  /**
   * @swagger
   * /api/solicitations:
   *   get:
   *     summary: Get all solicitations
   *     tags:
   *       - Solicitations
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
   *                 $ref: '#/components/schemas/Solicitation'
   */
  async list(req: Request, res: Response) {
    const solicitations = await solicitationRepository.find({
      relations: {
        gate: true,
        user: true,
        message: true,
      },
    })

    return res.json(solicitations)
  }

  /**
   * @swagger
   * /api/solicitations/{idGate}/gate:
   *   post:
   *     summary: Create a new solicitation
   *     tags:
   *       - Solicitations
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idGate
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: boolean
   *               message:
   *                 type: number
   *               code:
   *                 type: string
   *               valid:
   *                 type: boolean
   *               user_id:
   *                 type: string
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
    let { status, message, code, valid, user_id } = req.body
    const { idGate } = req.params

    if (!message) throw new BadRequestError('A mensagem é obrigatória')

    const user = await userRepository.findOneBy({
      id: user_id ?? '00000000-0000-0000-0000-000000000000',
    })
    const gate = await gateRepository.findOne({
      relations: { users: { devices: true } },
      where: { id: idGate },
    })
    const solicitation = await solicitationRepository.findOne({
      relations: { gate: true },
      where: { gate: { id: idGate }, valid: false },
    })
    const messageExists = await messageRepository.findOneBy({
      id: message,
    })

    if (!messageExists) throw new NotFoundError('A mensagem não existe')

    if (!gate) throw new NotFoundError('O portão não existe')

    if (!code) {
      status = !gate.open
    }

    const newSolicitation = solicitationRepository.create({
      status,
      message: messageExists,
      code,
      valid,
      gate,
      user,
    })

    if (!valid) {
      if (solicitation)
        throw new BadRequestError(
          `Ainda existe uma solicitação pendente para o portão ${gate.name}`,
        )

      await gateRepository.update(idGate, { provisional_open: status })
    } else {
      await gateRepository.update(idGate, {
        open: status,
        provisional_open: status,
        notified: false,
      })

      const notifications = [] as Notification[]

      gate.users.map(async (user) => {
        user.devices.map(async (device) => {
          notifications.push({
            device,
            title: gate.name,
            body: `${messageExists.description} pelo controle`,
          } as Notification)
        })
      })

      new PushNotificationController().send(notifications)
    }

    await solicitationRepository.save(newSolicitation)

    return res.status(201).json({ id: newSolicitation.id })
  }

  /**
   * @swagger
   * /api/solicitations/{idSolicitation}:
   *   put:
   *     summary: Update solicitation
   *     tags:
   *       - Solicitations
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idSolicitation
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: boolean
   *               message:
   *                 type: number
   *               code:
   *                 type: string
   *               valid:
   *                 type: boolean
   *     responses:
   *       204:
   *         description: No Content
   */
  async update(req: Request, res: Response) {
    const { status, message, code, valid } = req.body
    const { idSolicitation } = req.params

    const solicitation = await solicitationRepository.findOneBy({
      id: idSolicitation,
    })

    if (!solicitation) throw new NotFoundError('A solicitação não existe')

    await solicitationRepository.update(idSolicitation, {
      status,
      message,
      code,
      valid,
    })

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/solicitations/{idSolicitation}:
   *   delete:
   *     summary: Delete solicitation
   *     tags:
   *       - Solicitations
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idSolicitation
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: No Content
   */
  async delete(req: Request, res: Response) {
    const { idSolicitation } = req.params

    const solicitation = await solicitationRepository.findOneBy({
      id: idSolicitation,
    })

    if (!solicitation) throw new NotFoundError('A solicitação não existe')

    if (solicitation.valid)
      throw new NotFoundError('Uma solicitação válida não pode ser excluída')

    await solicitationRepository.delete(idSolicitation)

    return res.status(204).send()
  }
}
