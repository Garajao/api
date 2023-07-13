import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import bcrypt from 'bcrypt'

export class UserSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const userRepository = dataSource.getRepository(User)
        const roleRepository = dataSource.getRepository(Role)

        const role_admin = roleRepository.create({
            id: '98a048a3-db71-44bc-b33a-9b5be9250fb2'
        })

        const role_user = roleRepository.create({
            id: '28942a6a-36dd-4d19-96b6-621130f77994'
        })

        const usersData = [{
            id: 'f6303cba-591a-421b-9509-99cf647334a4',
            name: 'Matheus Bonadio',
            email: 'matheus@sou.unaerp.edu.br',
            login: 'matheus',
            password: await bcrypt.hash('12345', 10),
            active: true,
            role: role_admin
        },{
            id: '17ad518b-f1ef-4fdf-8e04-d84c0a48f97f',
            name: 'Marcello Bertão',
            email: 'marcello@sou.unaerp.edu.br',
            login: 'bertão',
            password: await bcrypt.hash('12345', 10),
            active: true,
            role: role_user
        }]

        const newUsers = userRepository.create(usersData)
        await userRepository.save(newUsers)
    }
}