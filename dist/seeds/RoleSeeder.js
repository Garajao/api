"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleSeeder = void 0;
const Role_1 = require("../entities/Role");
class RoleSeeder {
    async run(dataSource) {
        const roleRepository = dataSource.getRepository(Role_1.Role);
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
        ];
        const newRole = roleRepository.create(rolesData);
        await roleRepository.save(newRole);
    }
}
exports.RoleSeeder = RoleSeeder;
