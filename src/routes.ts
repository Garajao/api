import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { GateController } from './controllers/GateController'
import { SolicitationController } from './controllers/SolicitationController'
import { authMiddleware } from './middlewares/authMiddleware'
import { RoleController } from './controllers/RoleController'

const routes = Router()

routes.post('/users/login', new UserController().login)

routes.use(authMiddleware)

routes.get('/users', new UserController().list)
routes.post('/users', new UserController().create)
routes.patch('/users/:idUser', new UserController().update)
routes.delete('/users/:idUser', new UserController().delete)
routes.get('/users/profile', new UserController().profile)
routes.post('/users/:idUser/gate', new UserController().userGate)

routes.get('/gates', new GateController().list)
routes.get('/gates/:idGate', new GateController().find)
routes.get('/gates/:idUser/user', new GateController().filterByUser)
routes.post('/gates', new GateController().create)
routes.patch('/gates/:idGate', new GateController().update)
routes.delete('/gates/:idGate', new GateController().delete)
routes.get('/gates/:idGate/solicitations', new GateController().paging)

routes.get('/solicitations', new SolicitationController().list)
routes.post('/solicitations/:idGate/gate', new SolicitationController().create)
routes.patch('/solicitations/:idSolicitation', new SolicitationController().update)
routes.delete('/solicitations/:idSolicitation', new SolicitationController().delete)

routes.get('/roles', new RoleController().list)
routes.post('/roles', new RoleController().create)
routes.patch('/roles/:idRole', new RoleController().update)
routes.delete('/roles/:idRole', new RoleController().delete)


export default routes