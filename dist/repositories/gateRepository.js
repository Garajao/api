"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gateRepository = void 0;
const data_source_1 = require("../data-source");
const Gate_1 = require("../entities/Gate");
exports.gateRepository = data_source_1.appDataSource.getRepository(Gate_1.Gate);
