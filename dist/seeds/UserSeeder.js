"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSeeder = void 0;
const User_1 = require("../entities/User");
const Role_1 = require("../entities/Role");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserSeeder {
    async run(dataSource, factoryManager) {
        const userRepository = dataSource.getRepository(User_1.User);
        const roleRepository = dataSource.getRepository(Role_1.Role);
        const role_admin = roleRepository.create({
            id: '98a048a3-db71-44bc-b33a-9b5be9250fb2'
        });
        const role_user = roleRepository.create({
            id: '28942a6a-36dd-4d19-96b6-621130f77994'
        });
        const usersData = [{
                id: 'f6303cba-591a-421b-9509-99cf647334a4',
                name: 'Matheus Bonadio',
                email: 'matheus@sou.unaerp.edu.br',
                login: 'matheus',
                password: await bcrypt_1.default.hash('12345', 10),
                active: true,
                role: role_admin
            }, {
                id: '17ad518b-f1ef-4fdf-8e04-d84c0a48f97f',
                name: 'Marcello Bertão',
                email: 'marcello@sou.unaerp.edu.br',
                login: 'bertão',
                password: await bcrypt_1.default.hash('12345', 10),
                active: true,
                role: role_user
            }];
        const newUsers = userRepository.create(usersData);
        await userRepository.save(newUsers);
    }
}
exports.UserSeeder = UserSeeder;
