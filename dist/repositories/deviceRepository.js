"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceRepository = void 0;
const data_source_1 = require("../data-source");
const Device_1 = require("../entities/Device");
exports.deviceRepository = data_source_1.appDataSource.getRepository(Device_1.Device);
