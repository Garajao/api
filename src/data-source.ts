import 'dotenv/config'
import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'

import * as path from 'path'

import { MainSeeder } from './seeds/MainSeeder'

const port = process.env.DB_PORT as number | undefined

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: [path.join(__dirname, '/**/entities/*.{ts,js}')],
  migrations: [path.join(__dirname, '/**/migrations/*.{ts,js}')],
  seeds: [MainSeeder],
  ssl: true,
}

export const appDataSource = new DataSource(options)
