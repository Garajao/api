"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleSeeder = void 0;
const Role_1 = require("../entities/Role");
class RoleSeeder {
    async run(dataSource, factoryManager) {
        const roleRepository = dataSource.getRepository(Role_1.Role);
        const roleData = [{
                id: '98a048a3-db71-44bc-b33a-9b5be9250fb2',
                name: 'Admin',
                level: 1
            }];
        const newRole = roleRepository.create(roleData);
        await roleRepository.save(newRole);
    }
}
exports.RoleSeeder = RoleSeeder;
