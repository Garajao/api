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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const Solicitation_1 = require("./Solicitation");
/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - id
 *         - description
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the message
 *         description:
 *           type: string
 *           description: The description of the message
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the message was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the message was updated
 *         solicitations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Solicitation'
 *           description: The solicitations associated with the message
 */
let Message = exports.Message = class Message {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Message.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Message.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Message.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Message.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Solicitation_1.Solicitation, (solicitation) => solicitation.message),
    __metadata("design:type", Array)
], Message.prototype, "solicitations", void 0);
exports.Message = Message = __decorate([
    (0, typeorm_1.Entity)('messages')
], Message);
