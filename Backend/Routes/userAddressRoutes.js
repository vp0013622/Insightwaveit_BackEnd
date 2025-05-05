import express from 'express'
import { Create, GetAllUserAddress, GetAllNotPublishedUserAddress, GetAllUserAddressWithParams, GetUserAddressById, GetUserAddressByUserId, Edit, DeleteById } from '../Controllers/UserAddressController.js'

const UserAddressRouter = express.Router()

UserAddressRouter.post('/create', Create)
UserAddressRouter.get('/',  GetAllUserAddress)
UserAddressRouter.get('/notpublishedroles', GetAllNotPublishedUserAddress)
UserAddressRouter.post('/withparams', GetAllUserAddressWithParams)
UserAddressRouter.get('/:id', GetUserAddressById)
UserAddressRouter.get('/user/:id', GetUserAddressByUserId)
UserAddressRouter.put('/edit/:id', Edit)
UserAddressRouter.delete('/delete/:id', DeleteById)

export default UserAddressRouter