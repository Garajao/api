"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GateSeeder = void 0;
const Gate_1 = require("../entities/Gate");
class GateSeeder {
    async run(dataSource, factoryManager) {
        const gateRepository = dataSource.getRepository(Gate_1.Gate);
        const gatesData = [{
                id: 'f96652a1-b288-47f2-ae7d-f67b96995f86',
                name: 'My house',
                open: false,
                provisional_open: false,
                cep: '14096-900',
                address: 'Av. Costábile Romano',
                complement: 'Apto 205',
                number: 2201,
                city: 'Ribeirão Preto',
                uf: 'SP',
                image: "https://i.imgur.com/ARvbwsf.jpg"
            }, {
                id: 'ace9f0ff-1b73-41a5-952e-3b5a3154b611',
                name: 'Beach house',
                open: false,
                provisional_open: false,
                cep: '14096-900',
                address: 'Av. Costábile Romano',
                complement: '',
                number: 2201,
                city: 'Guarujá',
                uf: 'SP',
                image: "https://i.imgur.com/G8ROW2y.jpg"
            }];
        const newGates = gateRepository.create(gatesData);
        await gateRepository.save(newGates);
    }
}
exports.GateSeeder = GateSeeder;
