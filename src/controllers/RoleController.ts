import { Request, Response } from 'express'

import { BadRequestError, NotFoundError } from '../helpers/api-errors'
import { roleRepository } from '../repositories/roleRepository'

export class RoleController {
  /**
   * @swagger
   * /api/roles:
   *   get:
   *     summary: Get all roles
   *     tags:
   *       - Roles
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
   *                 $ref: '#/components/schemas/Role'
   */
  async list(req: Request, res: Response) {
    const roles = await roleRepository.find({
      relations: {
        users: true,
      },
    })

    return res.json(roles)
  }

  /**
   * @swagger
   * /api/roles:
   *   post:
   *     summary: Create role
   *     tags:
   *       - Roles
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
   *               level:
   *                 type: number
   *             required:
   *               - name
   *               - level
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   */
  async create(req: Request, res: Response) {
    const { name, level } = req.body

    if (!name) throw new BadRequestError('O nome é obrigatório')

    if (!level) throw new BadRequestError('O nível é obrigatório')

    const newRole = roleRepository.create({
      name,
      level,
    })

    await roleRepository.save(newRole)
    // return res.status(201).json({ id: newRole.id })
    return res.status(201).json(newRole)
  }

  /**
   * @swagger
   * /api/roles/{idRole}:
   *   put:
   *     summary: Update role
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idRole
   *         required: true
   *         schema:
   *           type: string
   *         description: Role ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               level:
   *                 type: number
   *             required:
   *               - name
   *               - level
   *     responses:
   *       204:
   *         description: No content
   */
  async update(req: Request, res: Response) {
    const { name, level } = req.body
    const { idRole } = req.params

    const role = await roleRepository.findOneBy({ id: idRole })

    if (!role) throw new NotFoundError('O papel não existe')

    await roleRepository.update(idRole, {
      name,
      level,
    })

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/roles/{idRole}:
   *   delete:
   *     summary: Delete role
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idRole
   *         required: true
   *         schema:
   *           type: string
   *         description: Role ID
   *     responses:
   *       204:
   *         description: No content
   */
  async delete(req: Request, res: Response) {
    const { idRole } = req.params

    const role = await roleRepository.findOneBy({ id: idRole })

    if (!role) throw new NotFoundError('O papel não existe')

    await roleRepository.delete(idRole)

    return res.status(204).send()
  }
}
