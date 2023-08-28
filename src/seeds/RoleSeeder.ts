import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'

import { Role } from '../entities/Role'

export class RoleSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role)

    const rolesData = [
      {
        id: '98a048a3-db71-44bc-b33a-9b5be9250fb2',
        name: 'Admin',
        level: 1,
      },
      {
        id: '28942a6a-36dd-4d19-96b6-621130f77994',
        name: 'User',
        level: 5,
      },
    ]

    const newRole = roleRepository.create(rolesData)
    await roleRepository.save(newRole)
  }
}
