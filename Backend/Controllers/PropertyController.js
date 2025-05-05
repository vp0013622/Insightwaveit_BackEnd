import { PropertyModel } from "../Models/PropertyModel.js"
import bcrypt from "bcryptjs"
import * as dotenv from 'dotenv'
import { emailRegex, SALT } from "../config.js"
import { RolesModel } from "../Models/RolesModel.js"
dotenv.config()


const Create = async (req, res) => {
    try {
        const { name, propertyTypeId, description, propertyAddress, owner, price, propertyStatus, features, listedDate} = req.body
        if (!name || !propertyTypeId || !description || !propertyAddress || !owner || !price || !propertyStatus || !features || !listedDate) {
            return res.status(400).json({
                message: 'bad request check data again',
                data: req.body
            })
        }
        console.log(req.body)
        
        const newProperty = {
            name: name,
            propertyTypeId: propertyTypeId,
            description: description,
            propertyAddress: propertyAddress,
            owner: owner,
            price: price,
            propertyStatus: propertyStatus,
            features: features,
            listedDate: listedDate,
            createdByUserId: req.user.id,
            updatedByUserId: req.user.id,
            published: true
        }
        const property = await PropertyModel.create(newProperty)
        return res.status(200).json({
            message: 'property added successfully',
            data: property
        })

    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const GetAllProperty = async (req, res) => {
    try {
        const properties = await PropertyModel.find({ published: true })
        return res.status(200).json({
            message: 'all properties',
            count: properties.length,
            data: properties
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const GetAllNotPublishedProperty = async (req, res) => {
    try {
        const properties = await PropertyModel.find({ published: false })
        return res.status(200).json({
            message: 'all not published properties',
            count: properties.length,
            data: properties
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const GetAllPropertyWithParams = async (req, res) => {
    try {
        const { name = null, propertyTypeId = null, owner = null, price = null, propertyStatus = null, listedDate = null, published = true } = req.body
        let filter = {}

        if (name !== null) {
            filter.name = { $regex: name, $options: "i" }
        }

        if (propertyTypeId !== null) {
            filter.propertyTypeId = propertyTypeId
        }

        if (owner !== null) {
            filter.owner = owner
        }

        if (price !== null) {
            filter.price = price
        }

        if (propertyStatus !== null) {
            filter.propertyStatus = propertyStatus
        }

        if (listedDate !== null) {
            filter.listedDate = listedDate
        }

        if (published !== null) {
            filter.published = published
        }

        const properties = await PropertyModel.find(filter)


        return res.status(200).json({
            message: 'all properties',
            count: properties.length,
            data: properties
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const GetPropertyById = async (req, res) => {
    try {
        var { id } = req.params
        const property = await PropertyModel.findById(id)
        if (property == null) {
            return res.status(404).json({
                message: 'property not found',
                data: property
            })
        }
        return res.status(200).json({
            message: 'property found',
            data: property
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const Edit = async (req, res) => {
    try {
        const { name, propertyTypeId, description, propertyAddress, owner, price, propertyStatus, features, listedDate} = req.body
        if (!name || !propertyTypeId || !description || !propertyAddress || !owner || !price || !propertyStatus || !features || !listedDate) {
            return res.status(400).json({
                message: 'bad request check data again',
                data: req.body
            })
        }
        var { id } = req.params
        const property = await PropertyModel.findById(id)
        if (!property) {
            return res.status(404).json({
                message: 'property not found'
            })
        }
        const newProperty = {
            name: name,
            propertyTypeId: propertyTypeId,
            description: description,
            propertyAddress: propertyAddress,
            owner: owner,
            price: price,
            propertyStatus: propertyStatus,
            features: features,
            listedDate: property.listedDate,
            createdByUserId: property.createdByUserId,
            updatedByUserId: req.usr.id,
            published: published
        }
        
        const result = await PropertyModel.findByIdAndUpdate(id, newProperty)
        if (!result) {
            return res.status(404).json({
                message: 'property not found'
            })
        }
        return res.status(201).json({
            message: 'property updated successfully'
        })
        

    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const DeleteById = async (req, res) => {
    try {
        var { id } = req.params
        const property = await PropertyModel.findById(id)
        if (property == null) {
            return res.status(404).json({
                message: 'property not found',
                data: property
            })
        }
        property.updatedByUserId = req.user.id
        property.published = false
        const result = await PropertyModel.findByIdAndUpdate(id, property)
        if (!result) {
            return res.status(404).json({
                message: 'property not found'
            })
        }
        return res.status(201).json({
            message: 'property deleted successfully'
        })
        

    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

export {
    Create, GetAllProperty, GetAllNotPublishedProperty, GetAllPropertyWithParams, GetPropertyById, Edit, DeleteById
}