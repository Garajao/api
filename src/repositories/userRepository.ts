import { appDataSource } from '../data-source'
import { User } from '../entities/User'

export const userRepository = appDataSource.getRepository(User)
