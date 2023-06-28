import { appDataSource } from "../data-source";
import { Role } from "../entities/Role";

export const roleRepository = appDataSource.getRepository(Role)