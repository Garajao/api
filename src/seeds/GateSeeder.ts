import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { Gate } from '../entities/Gate';

export class GateSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const gateRepository = dataSource.getRepository(Gate)

        const gatesData = [{
            id: 'f96652a1-b288-47f2-ae7d-f67b96995f86',
            name: 'UNAERP',
            open: false,
            provisional_open: false,
            cep: '14096-900',
            address: 'Av. Costábile Romano',
            complement: 'Sala 24B',
            number: 2201,
            city: 'Ribeirão Preto',
            uf: 'SP'
        }, {
            id: 'ace9f0ff-1b73-41a5-952e-3b5a3154b611',
            name: 'Casa na praia',
            open: false,
            provisional_open: false,
            cep: '14096-900',
            address: 'Av. Costábile Romano',
            complement: '',
            number: 2201,
            city: 'Guarujá',
            uf: 'SP'
        }]

        const newGates = gateRepository.create(gatesData)
        await gateRepository.save(newGates)
    }
}