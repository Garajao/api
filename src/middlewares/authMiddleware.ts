import { userRepository } from '../repositories/userRepository';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../helpers/api-errors';

type JwtPayload = {
    user_id: string
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (!authorization)
        throw new UnauthorizedError('Unauthorized')

    const token = authorization.split(' ')[1]

    const { user_id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

    const user = await userRepository.findOneBy({ id: user_id })

    if (!user)
        throw new UnauthorizedError('Unauthorized')

    const { password: _, ...loggedUser } = user

    req.user = loggedUser

    next()
}