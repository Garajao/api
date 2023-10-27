import { Request, Response } from 'express'

import { BadRequestError, NotFoundError } from '../helpers/api-errors'
import { messageRepository } from '../repositories/messageRepository'

export class MessageController {
  async list(req: Request, res: Response) {
    const messages = await messageRepository.find()

    return res.json(messages)
  }

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

  async delete(req: Request, res: Response) {
    const { idMessage } = req.params

    const message = await messageRepository.findOneBy({ id: Number(idMessage) })

    if (!message) throw new NotFoundError('A mensagem não existe')

    await messageRepository.delete(idMessage)

    return res.status(204).send()
  }
}
