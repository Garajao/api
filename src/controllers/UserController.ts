import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { gateRepository } from '../repositories/gateRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BadRequestError, ForbiddenError, NotFoundError } from '../helpers/api-errors';

export class UserController {
    async list(req: Request, res: Response) {
        const users = await userRepository.find({
            loadRelationIds: true
        })

        return res.status(200).json(users)
    }

    async create(req: Request, res: Response) {
        const { name, email, login, password } = req.body

        if (!name)
            throw new BadRequestError('Name is required')

        if (!email)
            throw new BadRequestError('Email is required')

        if (!login)
            throw new BadRequestError('Login is required')

        if (!password)
            throw new BadRequestError('Password is required')

        const loginExists = await userRepository.findOneBy({ login })

        if (loginExists)
            throw new BadRequestError('User login already exists')

        const emailExists = await userRepository.findOneBy({ email })

        if (emailExists)
            throw new BadRequestError('User email already existse')

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            name, email, login, password: hashPassword, active: true
        })

        await userRepository.save(newUser);

        return res.status(201).json({ id: newUser.id })
    }

    async update(req: Request, res: Response) {
        const { name, email, active, role } = req.body
        const { idUser } = req.params

        const user = await userRepository.findOneBy({ id: idUser })

        if (!user)
            throw new NotFoundError('The user does not exist')

        await userRepository.update(idUser, {
            name, email, active, role
        });

        return res.status(204).send()
    }

    async delete(req: Request, res: Response) {
        const { idUser } = req.params

        const user = await userRepository.findOneBy({ id: idUser })

        if (!user)
            throw new NotFoundError('The user does not exist')

        await userRepository.delete(idUser);

        return res.status(204).send()
    }

    async profile(req: Request, res: Response) {
        return res.status(200).json(req.user)
    }

    async userGate(req: Request, res: Response) {
        const { gate_id } = req.body
        const { idUser } = req.params

        const user = await userRepository.findOne({ relations: { gates: true }, where: { id: idUser } })

        if (!user)
            throw new NotFoundError('The user does not exist')

        if (!gate_id)
            throw new BadRequestError('Gate is required')

        const gate = await gateRepository.findOneBy({ id: gate_id })

        if (!gate)
            throw new NotFoundError('The gate does not exist')

        const checkRelations = user.gates.find(user_gate => user_gate.id == gate.id);

        if (checkRelations)
            throw new BadRequestError('The gate has already been linked to the user')

        const userUpdate = {
            ...user,
            gates: [...user.gates, gate]
        }

        await userRepository.save(userUpdate)

        return res.status(204).send()
    }

    async login(req: Request, res: Response) {
        const { login, password } = req.body

        if (!login)
            throw new BadRequestError('Login is required')

        if (!password)
            throw new BadRequestError('Password is required')

        const user = await userRepository.findOne({ loadRelationIds: true, where: { login } })

        if (!user) {
            throw new BadRequestError('Incorrect username or password');
        }

        if (!user.active) {
            throw new ForbiddenError('Inactive user');
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            throw new BadRequestError('Incorrect username or password');
        }

        const token = jwt.sign(
            { user_id: user.id },
            process.env.JWT_PASS ?? '',
            { expiresIn: '100y' }
        );

        const { password: _, ...userLogin } = user

        return res.status(200).json({
            user: userLogin,
            token
        });
    }
}