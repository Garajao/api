"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainSeeder = void 0;
const typeorm_extension_1 = require("typeorm-extension");
const UserSeeder_1 = require("./UserSeeder");
const GateSeeder_1 = require("./GateSeeder");
const RoleSeeder_1 = require("./RoleSeeder");
class MainSeeder {
    async run(dataSource, factoryManager) {
        await (0, typeorm_extension_1.runSeeder)(dataSource, RoleSeeder_1.RoleSeeder);
        await (0, typeorm_extension_1.runSeeder)(dataSource, UserSeeder_1.UserSeeder);
        await (0, typeorm_extension_1.runSeeder)(dataSource, GateSeeder_1.GateSeeder);
    }
}
exports.MainSeeder = MainSeeder;
