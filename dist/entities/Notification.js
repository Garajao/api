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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const Device_1 = require("./Device");
/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - body
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the notification
 *         title:
 *           type: string
 *           description: The title of the notification
 *         body:
 *           type: string
 *           description: The body of the notification
 *         expo_id:
 *           type: string
 *           nullable: true
 *           description: The expo id of the notification
 *         expo_status:
 *           type: string
 *           nullable: true
 *           description: The expo status of the notification
 *         expo_message:
 *           type: string
 *           nullable: true
 *           description: The expo message of the notification
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the notification was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the notification was updated
 *         device:
 *           $ref: '#/components/schemas/Device'
 *           description: The device associated with the notification
 */
let Notification = exports.Notification = class Notification {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "expo_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "expo_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "expo_message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Notification.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Notification.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Device_1.Device, (device) => device.notifications),
    (0, typeorm_1.JoinColumn)({ name: 'device_id' }),
    __metadata("design:type", Device_1.Device)
], Notification.prototype, "device", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications')
], Notification);
