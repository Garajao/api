import { Request, Response } from 'express'
import { In } from 'typeorm'

import { gateRepository } from '../repositories/gateRepository'
import { userRepository } from '../repositories/userRepository'
import { BadRequestError, NotFoundError } from '../helpers/api-errors'
import { solicitationRepository } from '../repositories/solicitationRepository'
import { Solicitation } from '../entities/Solicitation'
import { messageRepository } from '../repositories/messageRepository'
import { PushNotificationController } from './push_notifications/PushNotificationController'
import { Notification } from '../entities/Notification'
export class GateController {
  /**
   * @swagger
   * /api/gates:
   *   get:
   *     summary: Get all gates
   *     tags:
   *       - Gates
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
   *                 $ref: '#/components/schemas/Gate'
   */
  async list(req: Request, res: Response) {
    const gates = await gateRepository.find({ loadRelationIds: true })

    return res.json(gates)
  }

  /**
   * @swagger
   * /api/gates/{idGate}:
   *   get:
   *     summary: Get a gate
   *     tags:
   *       - Gates
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idGate
   *         required: true
   *         schema:
   *           type: string
   *         description: The gate ID
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 provisional_open:
   *                   type: boolean
   */
  async find(req: Request, res: Response) {
    const { idGate } = req.params

    const gate = await gateRepository.findOneBy({ id: idGate })

    if (!gate) throw new NotFoundError('O portão não existe')

    await gateRepository.update(idGate, {
      consulted_at: new Date().toISOString(),
    })

    return res.json({ provisional_open: gate?.provisional_open })
  }

  /**
   * @swagger
   * /api/gates/{idUser}/user/:
   *   get:
   *     summary: Get all gates by user
   *     tags:
   *       - Gates
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idUser
   *         required: true
   *         schema:
   *           type: string
   *         description: The user ID
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Gate'
   */
  async filterByUser(req: Request, res: Response) {
    const { idUser } = req.params

    const user = await userRepository.findOneBy({ id: idUser })

    if (!user) throw new NotFoundError('O usuário não existe')

    const gates = await gateRepository
      .createQueryBuilder('gate')
      .withDeleted()
      .leftJoinAndMapOne(
        'gate.solicitations',
        Solicitation,
        'solicitations',
        'solicitations.valid = true and solicitations.gate = gate.id and solicitations.message IN (:...ids)',
        { ids: [1, 2] },
      )
      .leftJoin('gate.users', 'user')
      .leftJoinAndSelect('gate.users', 'users')
      .leftJoinAndSelect('users.role', 'role')
      .leftJoinAndSelect('users.devices', 'devices')
      .leftJoinAndSelect('solicitations.message', 'message')
      .where('user.id = :id', { id: idUser })
      .orderBy('solicitations.updated_at', 'DESC', 'NULLS LAST')
      .addOrderBy('gate.consulted_at', 'DESC')
      .addOrderBy('gate.name', 'ASC')
      .addOrderBy('role.level', 'ASC')
      .addOrderBy('users.name', 'ASC')
      .getMany()

    return res.json(gates)
  }

  /**
   * @swagger
   * /api/gates:
   *   post:
   *     summary: Create a new gate
   *     tags:
   *       - Gates
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               cep:
   *                 type: string
   *               address:
   *                 type: string
   *               complement:
   *                 type: string
   *               number:
   *                 type: string
   *               city:
   *                 type: string
   *               uf:
   *                 type: string
   *               image:
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
    const { name, cep, address, complement, number, city, uf, image } = req.body

    if (!name) throw new BadRequestError('O nome é obrigatório')

    if (!cep) throw new BadRequestError('O CEP é obrigatório')

    if (!address) throw new BadRequestError('O endereço é obrigatório')

    if (!number) throw new BadRequestError('O número é obrigatório')

    if (!city) throw new BadRequestError('A cidade é obrigatória')

    if (!uf) throw new BadRequestError('O UF é obrigatório')

    const newGate = gateRepository.create({
      name,
      cep,
      address,
      complement,
      number,
      city,
      uf,
      image,
    })

    await gateRepository.save(newGate)
    return res.status(201).json({ id: newGate.id })
  }

  /**
   * @swagger
   * /api/gates/{idGate}:
   *   put:
   *     summary: Update gate
   *     tags:
   *       - Gates
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idGate
   *         required: true
   *         schema:
   *           type: string
   *         description: The gate ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               open:
   *                 type: boolean
   *               provisional_open:
   *                 type: boolean
   *               notified:
   *                 type: boolean
   *               cep:
   *                 type: string
   *               address:
   *                 type: string
   *               complement:
   *                 type: string
   *               number:
   *                 type: string
   *               city:
   *                 type: string
   *               uf:
   *                 type: string
   *               image:
   *                 type: string
   *     responses:
   *       204:
   *         description: No content
   */
  async update(req: Request, res: Response) {
    const {
      name,
      open,
      provisional_open,
      notified,
      cep,
      address,
      complement,
      number,
      city,
      uf,
      image,
    } = req.body
    const { idGate } = req.params

    const gate = await gateRepository.findOneBy({ id: idGate })

    if (!gate) throw new NotFoundError('O portão não existe')

    await gateRepository.update(idGate, {
      name,
      open,
      provisional_open,
      notified,
      cep,
      address,
      complement,
      number,
      city,
      uf,
      image,
    })

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/gates/{idGate}:
   *   delete:
   *     summary: Delete gate
   *     tags:
   *       - Gates
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idGate
   *         required: true
   *         schema:
   *           type: string
   *         description: The gate ID
   *     responses:
   *       204:
   *         description: No content
   */
  async delete(req: Request, res: Response) {
    const { idGate } = req.params

    const gate = await gateRepository.findOneBy({ id: idGate })

    if (!gate) throw new NotFoundError('O portão não existe')

    await gateRepository.delete(idGate)

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/gates/{idGate}/solicitations/valid:
   *   put:
   *     summary: Valid solicitations
   *     tags:
   *       - Gates
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idGate
   *         required: true
   *         schema:
   *           type: string
   *         description: The gate ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             properties:
   *               status:
   *                 type: boolean
   *     responses:
   *       204:
   *         description: No content
   */
  async validSolicitations(req: Request, res: Response) {
    const { status } = req.body
    const { idGate } = req.params

    const gate = await gateRepository.findOne({
      relations: { users: { devices: true } },
      where: { id: idGate },
    })

    if (!gate) throw new NotFoundError('O portão não existe')

    const solicitations = await solicitationRepository.find({
      relations: { user: true },
      where: { gate: { id: idGate }, valid: false },
    })

    solicitations.map(async (solicitation) => {
      await solicitationRepository.update(solicitation.id, {
        valid: true,
        message: status ? 1 : 2,
      })

      const messages = await messageRepository.findBy({ id: In([1, 2]) })
      const notifications = [] as Notification[]

      gate.users.map(async (user) => {
        if (solicitation.user?.id === user.id) return

        user.devices.map(async (device) => {
          notifications.push({
            device,
            title: gate.name,
            body: `${
              status ? messages[0].description : messages[1].description
            } por ${solicitation.user?.name}`,
          } as Notification)
        })
      })

      new PushNotificationController().send(notifications)
    })
    await gateRepository.update(idGate, {
      open: status,
      provisional_open: status,
      notified: false,
    })

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/gates/{idGate}/solicitations:
   *   get:
   *     summary: Get solicitations by gate
   *     tags:
   *       - Gates
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idGate
   *         required: true
   *         schema:
   *           type: string
   *         description: The gate ID
   *       - in: query
   *         name: offset
   *         required: false
   *         schema:
   *           type: string
   *         description: The offset
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: string
   *         description: The limit
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
  async paging(req: Request, res: Response) {
    const { idGate } = req.params
    const { offset, limit } = req.query

    const gate = await gateRepository.findOneBy({ id: idGate })

    if (!gate) throw new NotFoundError('O portão não existe')

    const solicitations = await solicitationRepository.find({
      relations: { user: true, gate: true, message: true },
      where: { gate: { id: idGate } },
      order: { updated_at: 'DESC' },
      skip: Number(offset),
      take: Number(limit),
    })

    return res.status(200).json(solicitations)
  }

  /**
   * @swagger
   * /api/gates/open:
   *   get:
   *     summary: Check if the gate is open
   *     tags:
   *       - Gates
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       204:
   *         description: No content
   */
  async checkGateIsOpen(req: Request, res: Response) {
    const spreadDateToOnline = new Date()
    spreadDateToOnline.setSeconds(
      spreadDateToOnline.getSeconds() -
        Number(process.env.TIME_LIMIT_TO_ONLINE),
    )

    const spreadDateToNotify = new Date()
    spreadDateToNotify.setMinutes(
      spreadDateToNotify.getMinutes() -
        Number(process.env.TIMEOUT_TO_NOTIFY_GATE),
    )

    const gates = await gateRepository
      .createQueryBuilder('gate')
      .leftJoinAndMapOne(
        'gate.solicitations',
        Solicitation,
        'solicitations',
        'solicitations.valid = true and solicitations.gate = gate.id and solicitations.message IN (:...ids)',
        { ids: [1, 2] },
      )
      .leftJoinAndSelect('gate.users', 'users')
      .leftJoinAndSelect('users.devices', 'devices')
      .where('gate.open = :open', { open: true })
      .andWhere('gate.consulted_at > :date', {
        date: spreadDateToOnline,
      })
      .orderBy('solicitations.updated_at', 'DESC', 'NULLS LAST')
      .getMany()

    const notifications = [] as Notification[]

    gates.map(async (gate) => {
      const solicitation = gate.solicitations as unknown as Solicitation

      if (spreadDateToNotify < solicitation.updated_at) return

      if (gate.notified) return

      gate.users.map(async (user) => {
        user.devices.map(async (device) => {
          notifications.push({
            device,
            title: gate.name,
            body: `Atenção, o seu portão está aberto a mais de ${process.env.TIMEOUT_TO_NOTIFY_GATE} minuto(s), caso tenha esquecido, acesse o app para fechá-lo!`,
          } as Notification)
        })
      })

      await gateRepository.update(gate.id, {
        notified: true,
      })
    })

    new PushNotificationController().send(notifications)

    return res.status(204).send()
  }
}
