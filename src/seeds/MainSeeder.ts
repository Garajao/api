import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager, runSeeder } from "typeorm-extension";
import { UserSeeder } from "./UserSeeder";
import { GateSeeder } from "./GateSeeder";
import { RoleSeeder } from "./RoleSeeder";

export class MainSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        await runSeeder(dataSource, RoleSeeder)
        await runSeeder(dataSource, UserSeeder)
        await runSeeder(dataSource, GateSeeder)
    }
}