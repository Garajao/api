"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainSeeder = void 0;
const typeorm_extension_1 = require("typeorm-extension");
const UserSeeder_1 = require("./UserSeeder");
const GateSeeder_1 = require("./GateSeeder");
const RoleSeeder_1 = require("./RoleSeeder");
const MessageSeeder_1 = require("./MessageSeeder");
class MainSeeder {
    async run(dataSource, factoryManager) {
        await (0, typeorm_extension_1.runSeeder)(dataSource, RoleSeeder_1.RoleSeeder);
        await (0, typeorm_extension_1.runSeeder)(dataSource, MessageSeeder_1.MessageSeeder);
        await (0, typeorm_extension_1.runSeeder)(dataSource, GateSeeder_1.GateSeeder);
        await (0, typeorm_extension_1.runSeeder)(dataSource, UserSeeder_1.UserSeeder);
    }
}
exports.MainSeeder = MainSeeder;
