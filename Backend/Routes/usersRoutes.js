import express from 'express'
import { GetAllUsers, GetAllNotPublishedUsers, GetUserById, Edit, DeleteById, GetAllUsersWithParams, Register } from '../Controllers/UsersController.js'
import { RoleAuthMiddleware } from '../Middlewares/RoleAuthMiddelware.js'

const UsersRouter = express.Router()
UsersRouter.post('/register',  RoleAuthMiddleware("admin"), Register) //only admin
UsersRouter.get('/',  RoleAuthMiddleware("admin"), GetAllUsers)//only for admin
UsersRouter.get('/notpublishedusers',  RoleAuthMiddleware("admin"), GetAllNotPublishedUsers)//only for admin
UsersRouter.post('/withparams',  RoleAuthMiddleware("admin"), GetAllUsersWithParams)//only for admin
UsersRouter.get('/:id',  RoleAuthMiddleware("admin", "executive", "sales"), GetUserById)//only for admin
UsersRouter.put('/edit/:id',  RoleAuthMiddleware("admin"), Edit)//only for admin
UsersRouter.delete('/delete/:id',  RoleAuthMiddleware("admin"), DeleteById)//only for admin
export default UsersRouter
