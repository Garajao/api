"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRepository = void 0;
const data_source_1 = require("../data-source");
const Message_1 = require("../entities/Message");
exports.messageRepository = data_source_1.appDataSource.getRepository(Message_1.Message);
