import express from 'express'
import { Create, GetAllRoles, GetAllNotPublishedRoles, GetAllRolesWithParams, GetRoleById, Edit, DeleteById } from '../Controllers/RolesController.js'

const RolesRouter = express.Router()
RolesRouter.post('/create', Create) //only admin
RolesRouter.get('/',  GetAllRoles)//only for admin
RolesRouter.get('/notpublishedroles', GetAllNotPublishedRoles)//only for admin
RolesRouter.post('/withparams', GetAllRolesWithParams)//only for admin
RolesRouter.get('/:id', GetRoleById)//only for admin
RolesRouter.put('/edit/:id', Edit)//only for admin
RolesRouter.delete('/delete/:id', DeleteById)//only for admin
export default RolesRouter