"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solicitationRepository = void 0;
const data_source_1 = require("../data-source");
const Solicitation_1 = require("../entities/Solicitation");
exports.solicitationRepository = data_source_1.appDataSource.getRepository(Solicitation_1.Solicitation);
