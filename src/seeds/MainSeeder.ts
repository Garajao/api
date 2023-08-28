import { DataSource } from 'typeorm'
import { Seeder, runSeeder } from 'typeorm-extension'

import { UserSeeder } from './UserSeeder'
import { GateSeeder } from './GateSeeder'
import { RoleSeeder } from './RoleSeeder'
import { MessageSeeder } from './MessageSeeder'

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, RoleSeeder)
    await runSeeder(dataSource, MessageSeeder)
    await runSeeder(dataSource, GateSeeder)
    await runSeeder(dataSource, UserSeeder)
  }
}
