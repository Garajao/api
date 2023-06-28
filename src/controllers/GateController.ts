import { Request, Response } from "express";
import { gateRepository } from "../repositories/gateRepository";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import { solicitationRepository } from "../repositories/solicitationRepository";

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

        const gates = await gateRepository.findOne({
            where: { id: idGate }
        })

        return res.json(gates);
    }

    async filterByUser(req: Request, res: Response) {
        const { idUser } = req.params

        const user = await userRepository.findOneBy({ id: idUser })

        if (!user)
            throw new NotFoundError('The user does not exist')

        const gates = await gateRepository.find({
            where: { users: { id: idUser } }
        })

        return res.json(gates);
    }

    async create(req: Request, res: Response) {
        const { name, cep, address, complement, number, city, uf } = req.body

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
            name, cep, address, complement, number, city, uf
        })

        await gateRepository.save(newGate)
        return res.status(201).json({ id: newGate.id })
    }

    async update(req: Request, res: Response) {

        const { name, open, provisional_open, cep, address, complement, number, city, uf } = req.body
        const { idGate } = req.params

        const gate = await gateRepository.findOneBy({ id: idGate })

        if (!gate)
            throw new NotFoundError('The gate does not exist')

        await gateRepository.update(idGate, {
            name, open, provisional_open, cep, address, complement, number, city, uf
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

    async paging(req: Request, res: Response) {
        const { idGate } = req.params
        const { offset, limit } = req.query

        const gate = await gateRepository.findOneBy({ id: idGate })

        if (!gate)
            throw new NotFoundError('The gate does not exist')

        const solicitations = await solicitationRepository.find({
            relations: { user: true, gate: true },
            where: { gate: { id: idGate } },
            order: { updated_at: 'DESC', }, skip: Number(offset), take: Number(limit)
        })

        return res.json(solicitations);
    }
}