import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { Role } from '../entities/Role';

export class RoleSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const roleRepository = dataSource.getRepository(Role)

        const roleData = [{
            id: '98a048a3-db71-44bc-b33a-9b5be9250fb2',
            name: 'Admin',
            level: 1
        }]

        const newRole = roleRepository.create(roleData)
        await roleRepository.save(newRole)
    }
}