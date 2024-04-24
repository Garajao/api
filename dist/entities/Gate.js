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
exports.Gate = void 0;
const typeorm_1 = require("typeorm");
const Solicitation_1 = require("./Solicitation");
const User_1 = require("./User");
/**
 * @swagger
 * components:
 *   schemas:
 *     Gate:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - open
 *         - provisional_open
 *         - notified
 *         - cep
 *         - address
 *         - number
 *         - city
 *         - uf
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the gate
 *         name:
 *           type: string
 *           description: The name of the gate
 *         open:
 *           type: boolean
 *           description: The status of the gate
 *         provisional_open:
 *           type: boolean
 *           description: The provisional status of the gate
 *         notified:
 *           type: boolean
 *           description: The notification status of the gate
 *         cep:
 *           type: string
 *           description: The CEP of the gate
 *         address:
 *           type: string
 *           description: The address of the gate
 *         complement:
 *           type: string
 *           description: The complement of the gate
 *         number:
 *           type: number
 *           description: The number of the gate
 *         city:
 *           type: string
 *           description: The city of the gate
 *         uf:
 *           type: string
 *           description: The UF of the gate
 *         image:
 *           type: string
 *           description: The image of the gate
 *         consulted_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the gate was consulted
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the gate was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the gate was updated
 *         solicitations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Solicitation'
 *           description: The solicitations associated with the gate
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 */
let Gate = exports.Gate = class Gate {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Gate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Gate.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Gate.prototype, "open", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Gate.prototype, "provisional_open", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Gate.prototype, "notified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Gate.prototype, "cep", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Gate.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Gate.prototype, "complement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Gate.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Gate.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Gate.prototype, "uf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Gate.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Gate.prototype, "consulted_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Gate.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Gate.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Solicitation_1.Solicitation, (solicitation) => solicitation.gate),
    __metadata("design:type", Array)
], Gate.prototype, "solicitations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1.User, (user) => user.gates),
    (0, typeorm_1.JoinTable)({
        name: 'user_gate',
        joinColumn: {
            name: 'gate_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Gate.prototype, "users", void 0);
exports.Gate = Gate = __decorate([
    (0, typeorm_1.Entity)('gates')
], Gate);
