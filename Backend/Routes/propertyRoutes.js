import express from 'express'
import { Create, GetAllProperty, GetAllNotPublishedProperty, GetAllPropertyWithParams, GetPropertyById, Edit, DeleteById,  } from '../Controllers/PropertyController.js'
const PropertyRouter = express.Router()

PropertyRouter.post('/create', Create)
PropertyRouter.get('/',  GetAllProperty)
PropertyRouter.get('/notpublishedusers', GetAllNotPublishedProperty)
PropertyRouter.post('/withparams', GetAllPropertyWithParams)
PropertyRouter.get('/:id', GetPropertyById)
PropertyRouter.put('/edit/:id', Edit)
PropertyRouter.delete('/delete/:id', DeleteById)

export default PropertyRouter