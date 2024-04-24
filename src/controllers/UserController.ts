import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { userRepository } from '../repositories/userRepository'
import { gateRepository } from '../repositories/gateRepository'
import { roleRepository } from '../repositories/roleRepository'
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../helpers/api-errors'

export class UserController {
  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users
   *     tags:
   *       - Users
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
   *                 $ref: '#/components/schemas/User'
   */
  async list(req: Request, res: Response) {
    const users = await userRepository.find({
      loadRelationIds: true,
    })

    return res.status(200).json(users)
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     tags:
   *       - Users
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
   *               email:
   *                 type: string
   *               login:
   *                 type: string
   *               password:
   *                 type: string
   *               role_id:
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
    const { name, email, login, password, image, role_id } = req.body

    if (!name) throw new BadRequestError('O nome é obrigatório')

    if (!email) throw new BadRequestError('O email é obrigatório')

    if (!login) throw new BadRequestError('O login é obrigatório')

    if (!password) throw new BadRequestError('A senha é obrigatória')

    if (!role_id) throw new BadRequestError('O papel é obrigatório')

    const loginExists = await userRepository.findOneBy({ login })

    if (loginExists) throw new BadRequestError('O login já existe')

    const emailExists = await userRepository.findOneBy({ email })

    if (emailExists) throw new BadRequestError('O email já existe')

    const hashPassword = await bcrypt.hash(password, 10)

    const role = await roleRepository.findOneBy({ id: role_id })

    if (!role) throw new NotFoundError('O papel não existe')

    const newUser = userRepository.create({
      name,
      email,
      login,
      password: hashPassword,
      active: true,
      image,
      role,
    })

    await userRepository.save(newUser)

    return res.status(201).json({ id: newUser.id })
  }

  /**
   * @swagger
   * /api/users/{idUser}:
   *   put:
   *     summary: Update user
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idUser
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
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               active:
   *                 type: boolean
   *               image:
   *                 type: string
   *               role:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  async update(req: Request, res: Response) {
    const { name, email, active, image, role_id } = req.body
    const { idUser } = req.params

    const user = await userRepository.findOneBy({ id: idUser })

    if (!user) throw new NotFoundError('O usuário não existe')

    const role = await roleRepository.findOneBy({ id: role_id })

    if (!role) throw new NotFoundError('O papel não existe')

    await userRepository.update(idUser, {
      name,
      email,
      active,
      image,
      role,
    })

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/users/{idUser}:
   *   delete:
   *     summary: Delete user
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idUser
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: No Content
   */
  async delete(req: Request, res: Response) {
    const { idUser } = req.params

    const user = await userRepository.findOneBy({ id: idUser })

    if (!user) throw new NotFoundError('O usuário não existe')

    await userRepository.delete(idUser)

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/users/profile:
   *   get:
   *     summary: Get user profile
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  async profile(req: Request, res: Response) {
    return res.status(200).json(req.user)
  }

  /**
   * @swagger
   * /api/users/{idUser}/gate:
   *   post:
   *     summary: Add gate to user
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: idUser
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
   *               gate_id:
   *                 type: string
   *     responses:
   *       204:
   *         description: No Content
   */
  async userGate(req: Request, res: Response) {
    const { gate_id } = req.body
    const { idUser } = req.params

    const user = await userRepository.findOne({
      relations: { gates: true },
      where: { id: idUser },
    })

    if (!user) throw new NotFoundError('O usuário não existe')

    if (!gate_id) throw new BadRequestError('O portão é obrigatório')

    const gate = await gateRepository.findOneBy({ id: gate_id })

    if (!gate) throw new NotFoundError('O portão não existe')

    const checkRelations = user.gates.find(
      (user_gate) => user_gate.id === gate.id,
    )

    if (checkRelations)
      throw new BadRequestError('O portão já está relacionado ao usuário')

    const userUpdate = {
      ...user,
      gates: [...user.gates, gate],
    }

    await userRepository.save(userUpdate)

    return res.status(204).send()
  }

  /**
   * @swagger
   * /api/users/signIn:
   *   post:
   *     summary: Sign in
   *     tags:
   *       - Authorization
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               login:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 token:
   *                   type: string
   */
  async signIn(req: Request, res: Response) {
    const { login, password } = req.body

    if (!login) throw new BadRequestError('O login é obrigatório')

    if (!password) throw new BadRequestError('A senha é obrigatória')

    const user = await userRepository.findOne({
      relations: { devices: true },
      where: { login },
    })

    if (!user) throw new BadRequestError('Usuário ou senha incorretos')

    if (!user.active) throw new ForbiddenError('Usuário inativo')

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) throw new BadRequestError('Usuário ou senha incorretos')

    const token = jwt.sign({ user_id: user.id }, process.env.JWT_PASS ?? '', {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '30d',
    })

    await userRepository.update(user.id, {
      last_login: new Date().toISOString(),
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userLogin } = user

    return res.status(200).json({
      user: userLogin,
      token,
    })
  }

  /**
   * @swagger
   * /api/users/signOut:
   *   post:
   *     summary: Sign out
   *     tags:
   *       - Authorization
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  async signOut(req: Request, res: Response) {
    // const { login, password } = req.body

    return res.status(200).json({
      message: 'Logout realizado com sucesso',
    })
  }
}
