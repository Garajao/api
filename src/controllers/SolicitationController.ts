import { Request, Response } from "express";
import { solicitationRepository } from "../repositories/solicitationRepository";
import { userRepository } from "../repositories/userRepository";
import { gateRepository } from "../repositories/gateRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";

export class SolicitationController {
    async list(req: Request, res: Response) {
        const solicitations = await solicitationRepository.find({
            relations: {
                gate: true,
                user: true
            }
        })

        return res.json(solicitations);
    }

    async create(req: Request, res: Response) {
        let { status, method, status_code, message, code, valid, user_id } = req.body
        const { idGate } = req.params

        const user = await userRepository.findOneBy({ id: user_id ?? "00000000-0000-0000-0000-000000000000" })
        const gate = await gateRepository.findOneBy({ id: idGate })
        const solicitation = await solicitationRepository.findOne({
            relations: { gate: true },
            where: { gate: { id: idGate }, valid: false },
        });

        if (!method)
            throw new BadRequestError('Method is required')

        if (!status_code)
            throw new BadRequestError('Code is required')

        if (!message)
            throw new BadRequestError('Message is required')

        if (!gate)
            throw new NotFoundError('The gate does not exist')

        if (method == "APP") {
            status = !gate.open;
        }

        const newSolicitation = solicitationRepository.create({
            status, method, status_code, message, code, valid, gate, user
        })

        if (!valid) {
            if (solicitation)
                throw new BadRequestError('There is still a pending request for gate ' + gate.name)

            await gateRepository.update(idGate, { provisional_open: status });
        } else
            await gateRepository.update(idGate, { open: status, provisional_open: status });

        await solicitationRepository.save(newSolicitation);

        return res.status(201).json({ id: newSolicitation.id })
    }

    async update(req: Request, res: Response) {

        const { status, method, status_code, message, code, valid } = req.body
        const { idSolicitation } = req.params

        const solicitation = await solicitationRepository.findOneBy({ id: idSolicitation })

        if (!solicitation)
            throw new NotFoundError('The solicitation does not exist')

        await solicitationRepository.update(idSolicitation, {
            status, method, status_code, message, code, valid
        });

        return res.status(204).send()
    }

    async delete(req: Request, res: Response) {
        const { idSolicitation } = req.params

        const solicitation = await solicitationRepository.findOneBy({ id: idSolicitation })

        if (!solicitation)
            throw new NotFoundError('The solicitation does not exist')

        await solicitationRepository.delete(idSolicitation);

        return res.status(204).send()
    }
}