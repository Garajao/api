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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Gate_1 = require("./Gate");
const Solicitation_1 = require("./Solicitation");
const Role_1 = require("./Role");
const Device_1 = require("./Device");
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - login
 *         - password
 *         - active
 *         - created_at
 *         - updated_at
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         login:
 *           type: string
 *           description: The login of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         active:
 *           type: boolean
 *           description: The status of the user
 *         image:
 *           type: string
 *           nullable: true
 *           description: The image URL of the user
 *         last_login:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: The date and time of the user's last login
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was updated
 *         gates:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Gate'
 *           description: The gates associated with the user
 *         solicitations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Solicitation'
 *           description: The solicitations made by the user
 *         role:
 *           $ref: '#/components/schemas/Role'
 *           description: The role of the user
 *         devices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Device'
 *           description: The devices associated with the user
 */
let User = exports.User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], User.prototype, "login", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], User.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "last_login", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Gate_1.Gate, (gate) => gate.users),
    __metadata("design:type", Array)
], User.prototype, "gates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Solicitation_1.Solicitation, (solicitation) => solicitation.user),
    __metadata("design:type", Array)
], User.prototype, "solicitations", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Role_1.Role, (role) => role.users, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", Role_1.Role)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Device_1.Device, (device) => device.user),
    __metadata("design:type", Array)
], User.prototype, "devices", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
