"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solicitation = void 0;
const typeorm_1 = require("typeorm");
const Gate_1 = require("./Gate");
const User_1 = require("./User");
const Message_1 = require("./Message");
let Solicitation = exports.Solicitation = class Solicitation {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Solicitation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Solicitation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Solicitation.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Solicitation.prototype, "valid", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Solicitation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Solicitation.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Gate_1.Gate, (gate) => gate.solicitations, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'gate_id' }),
    __metadata("design:type", Gate_1.Gate)
], Solicitation.prototype, "gate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.solicitations),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], Solicitation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Message_1.Message, (message) => message.solicitations, {
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'message_id' }),
    __metadata("design:type", Object)
], Solicitation.prototype, "message", void 0);
exports.Solicitation = Solicitation = __decorate([
    (0, typeorm_1.Entity)('solicitations')
], Solicitation);
