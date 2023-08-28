import { Request, Response } from 'express';
import { gateRepository } from '../repositories/gateRepository';
import { userRepository } from '../repositories/userRepository';
import { BadRequestError, NotFoundError } from '../helpers/api-errors';
import { solicitationRepository } from '../repositories/solicitationRepository';
import { Solicitation } from '../entities/Solicitation';
import { messageRepository } from '../repositories/messageRepository';
import { In } from 'typeorm';
import { PushNotificationController } from './push_notifications/PushNotificationController';
import { Notification } from '../entities/Notification';

export class GateController {
    async list(req: Request, res: Response) {
        const gates = await gateRepository.find({ loadRelationIds: true })

        return res.json(gates);
    }

    async find(req: Request, res: Response) {
        const { idGate } = req.params

        const gate = await gateRepository.findOneBy({ id: idGate })

        if (!gate)
            throw new NotFoundError('The gate does not exist')

        await gateRepository.update(idGate, {
            consulted_at: new Date().toISOString()
        });

        return res.json({ provisional_open: gate?.provisional_open });
    }

    async filterByUser(req: Request, res: Response) {
        const { idUser } = req.params

        const user = await userRepository.findOneBy({ id: idUser })

        if (!user)
            throw new NotFoundError('The user does not exist')

        const gates = await gateRepository.createQueryBuilder('gate')
        .withDeleted() 
        .leftJoinAndMapOne('gate.solicitations', Solicitation, 'solicitations', 'solicitations.valid = true and solicitations.gate = gate.id and solicitations.message IN (:...ids)', { ids: [1, 2] })
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

        return res.json(gates);
    }

    async create(req: Request, res: Response) {
        const { name, cep, address, complement, number, city, uf, image } = req.body

        if (!name)
            throw new BadRequestError('Name is required')

        if (!cep)
            throw new BadRequestError('CEP is required')

        if (!address)
            throw new BadRequestError('Address is required')

        if (!number)
            throw new BadRequestError('Number is required')

        if (!city)
            throw new BadRequestError('City is required')

        if (!uf)
            throw new BadRequestError('UF is required')

        const newGate = gateRepository.create({
            name, cep, address, complement, number, city, uf, image
        })

        await gateRepository.save(newGate)
        return res.status(201).json({ id: newGate.id })
    }

    async update(req: Request, res: Response) {
        const { name, open, provisional_open, cep, address, complement, number, city, uf, image } = req.body
        const { idGate } = req.params

        const gate = await gateRepository.findOneBy({ id: idGate })

        if (!gate)
            throw new NotFoundError('The gate does not exist')

        await gateRepository.update(idGate, {
            name, open, provisional_open, cep, address, complement, number, city, uf, image
        });

        return res.status(204).send()
    }

    async delete(req: Request, res: Response) {
        const { idGate } = req.params

        const gate = await gateRepository.findOneBy({ id: idGate })

        if (!gate)
            throw new NotFoundError('The gate does not exist')

        await gateRepository.delete(idGate);

        return res.status(204).send()
    }

    async validSolicitations(req: Request, res: Response) {
        const { status } = req.body
        const { idGate } = req.params

        const gate = await gateRepository.findOne({
            relations: { users: { devices: true } },
            where: { id: idGate }
        })

        if (!gate)
            throw new NotFoundError('The gate does not exist')

        const solicitations = await solicitationRepository.find({
            relations: { user: true },
            where: { gate: { id: idGate }, valid: false }
        })

        solicitations.map(async (solicitation) => {
            await solicitationRepository.update(solicitation.id, { valid: true, message: status ? 1 : 2 });

            const messages = await messageRepository.findBy({ id: In([1, 2]) })
            const notifications = [] as Notification[]

            gate.users.map(async (user) => {
                if(solicitation.user?.id != user.id) {
                    user.devices.map(async (device) => {
                        notifications.push({
                            device: device, 
                            title: gate.name, 
                            body: `${status ? messages[0].description : messages[1].description} by ${solicitation.user?.name}`
                        } as Notification)
                    })
                }
            })

            new PushNotificationController().send(notifications)

        })
        await gateRepository.update(idGate, { open: status, provisional_open: status });

        return res.status(204).send()
    }

    async paging(req: Request, res: Response) {
        const { idGate } = req.params
        const { offset, limit } = req.query

        const gate = await gateRepository.findOneBy({ id: idGate })

        if (!gate)
            throw new NotFoundError('The gate does not exist')

        const solicitations = await solicitationRepository.find({
            relations: { user: true, gate: true, message: true },
            where: { gate: { id: idGate } },
            order: { updated_at: 'DESC', }, skip: Number(offset), take: Number(limit)
        })

        return res.json(solicitations);
    }
}