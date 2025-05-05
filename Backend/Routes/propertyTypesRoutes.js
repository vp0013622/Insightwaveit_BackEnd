import express from 'express'
import { Create, GetAllPropertyTypes, GetAllNotPublishedPropertyTypes, GetAllPropertyTypesWithParams, GetPropertyTypeById, Edit, DeleteById } from '../Controllers/PropertyTypesController.js'

const PropertyTypesRouter = express.Router()
PropertyTypesRouter.post('/create', Create) //only admin
PropertyTypesRouter.get('/',  GetAllPropertyTypes)//only for admin
PropertyTypesRouter.get('/notpublishedPropertyTypes', GetAllNotPublishedPropertyTypes)//only for admin
PropertyTypesRouter.post('/withparams', GetAllPropertyTypesWithParams)//only for admin
PropertyTypesRouter.get('/:id', GetPropertyTypeById)//only for admin
PropertyTypesRouter.put('/edit/:id', Edit)//only for admin
PropertyTypesRouter.delete('/delete/:id', DeleteById)//only for admin
export default PropertyTypesRouter