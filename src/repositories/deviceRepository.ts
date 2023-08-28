import { appDataSource } from '../data-source'
import { Device } from '../entities/Device'

export const deviceRepository = appDataSource.getRepository(Device)
