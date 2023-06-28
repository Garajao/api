import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import bcrypt from 'bcrypt'

export class UserSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const userRepository = dataSource.getRepository(User)
        const roleRepository = dataSource.getRepository(Role)

        const role = roleRepository.create({
            id: '98a048a3-db71-44bc-b33a-9b5be9250fb2'
        })

        const usersData = [{
            id: 'f6303cba-591a-421b-9509-99cf647334a4',
            name: 'Matheus Bonadio',
            email: 'matheus@sou.unaerp.edu.br',
            login: 'matheus',
            password: await bcrypt.hash('12345', 10),
            active: true,
            role: role
        }]

        const newUsers = userRepository.create(usersData)
        await userRepository.save(newUsers)
    }
}