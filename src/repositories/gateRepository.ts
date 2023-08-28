import { appDataSource } from '../data-source'
import { Gate } from '../entities/Gate'

export const gateRepository = appDataSource.getRepository(Gate)
