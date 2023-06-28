import { appDataSource } from "../data-source";
import { Solicitation } from "../entities/Solicitation";

export const solicitationRepository = appDataSource.getRepository(Solicitation)