import { Request, Response } from 'express'

import { BadRequestError, NotFoundError } from '../helpers/api-errors'
import { messageRepository } from '../repositories/messageRepository'

export class MessageController {
  /**
   * @swagger
   * /api/messages:
   *   get:
   *     summary: Get all messages
   *     tags:
   *       - Messages
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
   *                 $ref: '#/components/schemas/Message'
   */
  async list(req: Request, res: Response) {
    const messages = await messageRepository.find()

    return res.json(messages)
  }

  /**
   * @swagger
   * /api/messages:
   *   post:
   *     summary: Create message
   *     tags:
   *       - Messages
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               description:
   *                 type: string
   *             required:
   *               - description
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: number
   */
  async create(req: Request, res: Response) {
    const { description } = req.body

    if (!description) throw new BadRequestError('A descrição é obrigatória')

    const newMessage = messageRepository.create({
      description,
    })

    await messageRepository.save(newMessage)
    // return res.status(201).json({ id: newMessage.id })
    return res.status(201).json(newMessage)
  }

  /**
   * @swagger
   * /api/messages/{idMessage}:
   *   put:
   *     summary: Update message
   *     tags:
   *       - Messages
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idMessage
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               description:
   *                 type: string
   *             required:
   *               - description
   *     responses:
   *       204:
   *         description: No content
   */
  async update(req: Request, res: Response) {
    const { description } = req.body
    const { idMessage } = req.params

    const message = await messageRepository.findOneBy({ id: Number(idMessage) })

    if (!message) throw new NotFoundError('A mensagem não existe')

    await messageRepository.update(idMessage, {
      description,
    })

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/messages/{idMessage}:
   *   delete:
   *     summary: Delete a message
   *     tags:
   *       - Messages
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idMessage
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       204:
   *         description: No content
   */
  async delete(req: Request, res: Response) {
    const { idMessage } = req.params

    const message = await messageRepository.findOneBy({ id: Number(idMessage) })

    if (!message) throw new NotFoundError('A mensagem não existe')

    await messageRepository.delete(idMessage)

    return res.status(204).send()
  }
}
