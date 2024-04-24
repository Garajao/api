import { Router } from 'express'

import { UserController } from './controllers/UserController'
import { GateController } from './controllers/GateController'
import { SolicitationController } from './controllers/SolicitationController'
import { authMiddleware } from './middlewares/authMiddleware'
import { RoleController } from './controllers/RoleController'
import { MessageController } from './controllers/MessageController'
import { DeviceController } from './controllers/DeviceController'
import { NotificationController } from './controllers/push_notifications/NotificationController'

const routes = Router()

routes.post('/users/signIn', new UserController().signIn)

routes.use(authMiddleware)

routes.post('/users/signOut', new UserController().signOut)

routes.get('/users', new UserController().list)
routes.post('/users', new UserController().create)
routes.put('/users/:idUser', new UserController().update)
routes.delete('/users/:idUser', new UserController().delete)
routes.get('/users/profile', new UserController().profile)
routes.post('/users/:idUser/gate', new UserController().userGate)

routes.get('/gates/open', new GateController().checkGateIsOpen)
routes.get('/gates', new GateController().list)
routes.get('/gates/:idGate', new GateController().find)
routes.get('/gates/:idUser/user', new GateController().filterByUser)
routes.post('/gates', new GateController().create)
routes.put('/gates/:idGate', new GateController().update)
routes.delete('/gates/:idGate', new GateController().delete)
routes.put(
  '/gates/:idGate/solicitations/valid',
  new GateController().validSolicitations,
)
routes.get('/gates/:idGate/solicitations', new GateController().paging)

routes.get('/solicitations', new SolicitationController().list)
routes.post('/solicitations/:idGate/gate', new SolicitationController().create)
routes.put(
  '/solicitations/:idSolicitation',
  new SolicitationController().update,
)
routes.delete(
  '/solicitations/:idSolicitation',
  new SolicitationController().delete,
)

routes.get('/roles', new RoleController().list)
routes.post('/roles', new RoleController().create)
routes.put('/roles/:idRole', new RoleController().update)
routes.delete('/roles/:idRole', new RoleController().delete)

routes.get('/messages', new MessageController().list)
routes.post('/messages', new MessageController().create)
routes.put('/messages/:idMessage', new MessageController().update)
routes.delete('/messages/:idMessage', new MessageController().delete)

routes.get('/devices', new DeviceController().list)
routes.get(
  '/devices/pushToken/:pushToken',
  new DeviceController().filterByPushToken,
)
routes.post('/devices', new DeviceController().create)
routes.put('/devices/:idDevice', new DeviceController().update)
routes.delete('/devices/:idDevice', new DeviceController().delete)
routes.put('/devices/:idDevice/restore', new DeviceController().restore)

routes.get('/notifications', new NotificationController().list)
routes.post('/notifications', new NotificationController().create)
routes.put(
  '/notifications/:idNotification',
  new NotificationController().update,
)
routes.delete(
  '/notifications/:idNotification',
  new NotificationController().delete,
)

export default routes
