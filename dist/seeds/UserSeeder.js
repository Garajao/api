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
        const role = roleRepository.create({
            id: '98a048a3-db71-44bc-b33a-9b5be9250fb2'
        });
        const usersData = [{
                id: 'f6303cba-591a-421b-9509-99cf647334a4',
                name: 'Matheus Bonadio',
                email: 'matheus@sou.unaerp.edu.br',
                login: 'matheus',
                password: await bcrypt_1.default.hash('12345', 10),
                active: true,
                role: role
            }];
        const newUsers = userRepository.create(usersData);
        await userRepository.save(newUsers);
    }
}
exports.UserSeeder = UserSeeder;
