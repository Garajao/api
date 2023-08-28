import { Request, Response } from 'express'

import { BadRequestError, NotFoundError } from '../helpers/api-errors'
import { roleRepository } from '../repositories/roleRepository'

export class RoleController {
  async list(req: Request, res: Response) {
    const roles = await roleRepository.find({
      relations: {
        users: true,
      },
    })

    return res.json(roles)
  }

  async create(req: Request, res: Response) {
    const { name, level } = req.body

    if (!name) throw new BadRequestError('Name is required')

    if (!level) throw new BadRequestError('Level is required')

    const newRole = roleRepository.create({
      name,
      level,
    })

    await roleRepository.save(newRole)
    // return res.status(201).json({ id: newRole.id })
    return res.status(201).json(newRole)
  }

  async update(req: Request, res: Response) {
    const { name, level } = req.body
    const { idRole } = req.params

    const role = await roleRepository.findOneBy({ id: idRole })

    if (!role) throw new NotFoundError('The role does not exist')

    await roleRepository.update(idRole, {
      name,
      level,
    })

    return res.status(204).send()
  }

  async delete(req: Request, res: Response) {
    const { idRole } = req.params

    const role = await roleRepository.findOneBy({ id: idRole })

    if (!role) throw new NotFoundError('The role does not exist')

    await roleRepository.delete(idRole)

    return res.status(204).send()
  }
}
