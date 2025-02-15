"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("./controllers/UserController");
const GateController_1 = require("./controllers/GateController");
const SolicitationController_1 = require("./controllers/SolicitationController");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const RoleController_1 = require("./controllers/RoleController");
const MessageController_1 = require("./controllers/MessageController");
const DeviceController_1 = require("./controllers/DeviceController");
const NotificationController_1 = require("./controllers/push_notifications/NotificationController");
const routes = (0, express_1.Router)();
routes.post('/users/signIn', new UserController_1.UserController().signIn);
routes.use(authMiddleware_1.authMiddleware);
routes.post('/users/signOut', new UserController_1.UserController().signOut);
routes.get('/users', new UserController_1.UserController().list);
routes.post('/users', new UserController_1.UserController().create);
routes.put('/users/:idUser', new UserController_1.UserController().update);
routes.delete('/users/:idUser', new UserController_1.UserController().delete);
routes.get('/users/profile', new UserController_1.UserController().profile);
routes.post('/users/:idUser/gate', new UserController_1.UserController().userGate);
routes.get('/gates/open', new GateController_1.GateController().checkGateIsOpen);
routes.get('/gates', new GateController_1.GateController().list);
routes.get('/gates/:idGate', new GateController_1.GateController().find);
routes.get('/gates/:idUser/user', new GateController_1.GateController().filterByUser);
routes.post('/gates', new GateController_1.GateController().create);
routes.put('/gates/:idGate', new GateController_1.GateController().update);
routes.delete('/gates/:idGate', new GateController_1.GateController().delete);
routes.put('/gates/:idGate/solicitations/valid', new GateController_1.GateController().validSolicitations);
routes.get('/gates/:idGate/solicitations', new GateController_1.GateController().paging);
routes.get('/solicitations', new SolicitationController_1.SolicitationController().list);
routes.post('/solicitations/:idGate/gate', new SolicitationController_1.SolicitationController().create);
routes.put('/solicitations/:idSolicitation', new SolicitationController_1.SolicitationController().update);
routes.delete('/solicitations/:idSolicitation', new SolicitationController_1.SolicitationController().delete);
routes.get('/roles', new RoleController_1.RoleController().list);
routes.post('/roles', new RoleController_1.RoleController().create);
routes.put('/roles/:idRole', new RoleController_1.RoleController().update);
routes.delete('/roles/:idRole', new RoleController_1.RoleController().delete);
routes.get('/messages', new MessageController_1.MessageController().list);
routes.post('/messages', new MessageController_1.MessageController().create);
routes.put('/messages/:idMessage', new MessageController_1.MessageController().update);
routes.delete('/messages/:idMessage', new MessageController_1.MessageController().delete);
routes.get('/devices', new DeviceController_1.DeviceController().list);
routes.get('/devices/pushToken/:pushToken', new DeviceController_1.DeviceController().filterByPushToken);
routes.post('/devices', new DeviceController_1.DeviceController().create);
routes.put('/devices/:idDevice', new DeviceController_1.DeviceController().update);
routes.delete('/devices/:idDevice', new DeviceController_1.DeviceController().delete);
routes.put('/devices/:idDevice/restore', new DeviceController_1.DeviceController().restore);
routes.get('/notifications', new NotificationController_1.NotificationController().list);
routes.post('/notifications', new NotificationController_1.NotificationController().create);
routes.put('/notifications/:idNotification', new NotificationController_1.NotificationController().update);
routes.delete('/notifications/:idNotification', new NotificationController_1.NotificationController().delete);
exports.default = routes;
