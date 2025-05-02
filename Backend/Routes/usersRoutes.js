import express from 'express'
import { GetAllUsers, GetAllNotPublishedUsers, GetUserById, Edit, DeleteById, GetAllUsersWithParams, Register } from '../Controllers/UsersController.js'

const UsersRouter = express.Router()
UsersRouter.post('/register', Register) //only admin
UsersRouter.get('/',  GetAllUsers)//only for admin
UsersRouter.get('/notpublishedusers', GetAllNotPublishedUsers)//only for admin
UsersRouter.post('/withparams', GetAllUsersWithParams)//only for admin
UsersRouter.get('/:id', GetUserById)//only for admin
UsersRouter.put('/edit/:id', Edit)//only for admin
UsersRouter.delete('/delete/:id', DeleteById)//only for admin
export default UsersRouter