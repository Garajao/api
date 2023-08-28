import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { Gate } from '../entities/Gate';
import bcrypt from 'bcrypt'

export class UserSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const userRepository = dataSource.getRepository(User)
        const roleRepository = dataSource.getRepository(Role)
        const gateRepository = dataSource.getRepository(Gate)

        const role_admin = roleRepository.create({ id: '98a048a3-db71-44bc-b33a-9b5be9250fb2' })
        const role_user = roleRepository.create({ id: '28942a6a-36dd-4d19-96b6-621130f77994' })

        const gate_1 = gateRepository.create({ id: 'f96652a1-b288-47f2-ae7d-f67b96995f86' })
        const gate_2 = gateRepository.create({ id: 'ace9f0ff-1b73-41a5-952e-3b5a3154b611' })

        const usersData = [{
            id: 'f6303cba-591a-421b-9509-99cf647334a4',
            name: 'John Doe',
            email: 'john-doe@mail.com',
            login: 'admin',
            password: await bcrypt.hash('admin', 10),
            active: true,
            role: role_admin,
            gates: [gate_1, gate_2],
            image: 'https://this-person-does-not-exist.com/img/avatar-gen11b7ef0efb70d031fb600a566926a588.jpg'
        }, {
            id: '17ad518b-f1ef-4fdf-8e04-d84c0a48f97f',
            name: 'Generic user',
            email: 'generic@mail.com',
            login: 'user',
            password: await bcrypt.hash('12345', 10),
            active: true,
            role: role_user,
            gates: [gate_1],
            image: 'https://this-person-does-not-exist.com/img/avatar-genfbb23d2166924a2a758f3896d3416256.jpg'
        }]

        const newUsers = userRepository.create(usersData)
        await userRepository.save(newUsers)
    }
}