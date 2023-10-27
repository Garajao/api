import { appDataSource } from '../data-source'
import { Message } from '../entities/Message'

export const messageRepository = appDataSource.getRepository(Message)
