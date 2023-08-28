import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { userRepository } from '../repositories/userRepository'
import { UnauthorizedError } from '../helpers/api-errors'

type JwtPayload = {
  user_id: string
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers

  if (!authorization) throw new UnauthorizedError('Sem autorização')

  const token = authorization.split(' ')[1]

  const { user_id } = jwt.verify(
    token,
    process.env.JWT_PASS ?? '',
  ) as JwtPayload

  const user = await userRepository.findOneBy({ id: user_id })

  if (!user) throw new UnauthorizedError('Sem autorização')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...loggedUser } = user

  req.user = loggedUser

  next()
}
