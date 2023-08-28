import { Request, Response } from 'express'
import { In } from 'typeorm'

import { solicitationRepository } from '../repositories/solicitationRepository'
import { userRepository } from '../repositories/userRepository'
import { gateRepository } from '../repositories/gateRepository'
import { BadRequestError, NotFoundError } from '../helpers/api-errors'
import { messageRepository } from '../repositories/messageRepository'
import { PushNotificationController } from './push_notifications/PushNotificationController'
import { Notification } from '../entities/Notification'

export class SolicitationController {
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

  async create(req: Request, res: Response) {
    let { status, message, code, valid, user_id } = req.body
    const { idGate } = req.params

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

    if (!message) throw new BadRequestError('Message is required')

    if (!gate) throw new NotFoundError('The gate does not exist')

    if (!code) {
      status = !gate.open
    }

    const newSolicitation = solicitationRepository.create({
      status,
      message,
      code,
      valid,
      gate,
      user,
    })

    if (!valid) {
      if (solicitation)
        throw new BadRequestError(
          'There is still a pending request for gate ' + gate.name,
        )

      await gateRepository.update(idGate, { provisional_open: status })
    } else {
      await gateRepository.update(idGate, {
        open: status,
        provisional_open: status,
      })

      const messages = await messageRepository.findBy({ id: In([1, 2]) })
      const notifications = [] as Notification[]

      gate.users.map(async (user) => {
        user.devices.map(async (device) => {
          notifications.push({
            device,
            title: gate.name,
            body: `${
              status ? messages[0].description : messages[1].description
            } by control`,
          } as Notification)
        })
      })

      new PushNotificationController().send(notifications)
    }

    await solicitationRepository.save(newSolicitation)

    return res.status(201).json({ id: newSolicitation.id })
  }

  async update(req: Request, res: Response) {
    const { status, message, code, valid } = req.body
    const { idSolicitation } = req.params

    const solicitation = await solicitationRepository.findOneBy({
      id: idSolicitation,
    })

    if (!solicitation)
      throw new NotFoundError('The solicitation does not exist')

    await solicitationRepository.update(idSolicitation, {
      status,
      message,
      code,
      valid,
    })

    return res.status(204).send()
  }

  async delete(req: Request, res: Response) {
    const { idSolicitation } = req.params

    const solicitation = await solicitationRepository.findOneBy({
      id: idSolicitation,
    })

    if (!solicitation)
      throw new NotFoundError('The solicitation does not exist')

    if (solicitation.valid)
      throw new NotFoundError('A valid solicitation cannot be deleted')

    await solicitationRepository.delete(idSolicitation)

    return res.status(204).send()
  }
}
