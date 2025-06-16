import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PropertyModel } from "../Models/PropertyModel.js"
import * as dotenv from 'dotenv'
import { PropertyImagesModel } from "../Models/PropertyImagesModel.js"
dotenv.config()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const CreatePropertyImageByPropertyId = async (req, res) =>{
    try {
        const { propertyId } = req.body;
        const file = req.file;
    
        // Validation
        if (!propertyId || !file) {
          return res.status(400).json({
            message: 'bad request',
          });
        }

        // Check for duplicate image by comparing filename (excluding the unique suffix)
        const baseFileName = file.originalname.split('.')[0].split('-')[0]; // Get base filename without unique suffix
        const existingImages = await PropertyImagesModel.find({ 
            propertyId,
            fileName: { $regex: new RegExp(`^${baseFileName}.*`) }
        });

        if (existingImages.length > 0) {
            // Delete the uploaded file since it's a duplicate
            const filePath = file.path;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res.status(400).json({
                message: 'Duplicate image detected. This image already exists for this property.',
                data: null
            });
        }
    
        const fileName = file.originalname;
        const imageUrl = `http://localhost:8080/propertyImagesUploads/${fileName}`
        //const imageUrl = `https://insightwaveit-backend-p0cl.onrender.com/propertyImagesUploads/${fileName}`; // Use IP if accessed from Flutter
    
        // Save new record
        const newFile = {
          propertyId,
          fileName,
          url: imageUrl,
          createdByUserId: req.user?.id,
          updatedByUserId: req.user?.id,
          published: true,
        };
    
        const propertyImages = await PropertyImagesModel.create(newFile);
    
        return res.status(200).json({
          message: 'property image added successfully',
          data: propertyImages,
        });
    
      } catch (error) {
        // If there's an error, ensure we clean up any uploaded file
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        return res.status(500).json({
          message: 'internal server error, while creating property image',
          error: error.message,
        });
      }
}

const GetAllPropertyImagesByPropertyId = async (req, res) =>{
    try {
        const { propertyId } = req.body
        var proerty = null
        if(propertyId){
            var result = await PropertyModel.findById(propertyId);
            if(result){
                proerty = result
            }
        }   
        if(proerty == null){
            res.status(404).json({
                message: 'property not found, to search images by property',
                data: proerty
            })
        }

        const propertyImages = await PropertyImagesModel.find({ propertyId: propertyId })
        return res.status(200).json({
            message: 'property images by property',
            count: propertyImages.length,
            data: propertyImages
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const GetPropertyImageById = async (req, res) =>{
        try {
        var { id } = req.params
        const propertyImage = await PropertyImagesModel.findById(id)
        if (propertyImage == null) {
            return res.status(404).json({
                message: 'property image not found',
                data: propertyImage
            })
        }
        return res.status(200).json({
            message: 'property image found',
            data: propertyImage
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const DeletePropertyImageById = async (req, res) =>{
    try {
        var { id } = req.params
        const propertyImage = await PropertyImagesModel.findById(id)
        if (propertyImage == null) {
            return res.status(404).json({
                message: 'property image not found',
                data: propertyImage
            })
        }
        propertyImage.updatedByUserId = req.user.id
        propertyImage.published = false
        const result = await PropertyImagesModel.findByIdAndUpdate(id, propertyImage)
        if (!result) {
            return res.status(404).json({
                message: 'property image not found'
            })
        }
        return res.status(201).json({
            message: 'property image deleted successfully'
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const DeleteAllPropertyImageById = async (req, res) =>{
    try {
        const { propertyId } = req.body
        const propertyImages = await PropertyImagesModel.find({propertyId: propertyId})
        if (propertyImages == null || propertyImages.length <= 0) {
            return res.status(404).json({
                message: 'property images not found to delete',
                data: propertyImages
            })
        }

        for(var primage in  propertyImages){
            primage.updatedByUserId = req.user.id
            primage.published = false
            const result = await PropertyImagesModel.findByIdAndUpdate(primage._id, propertyImage)
            if (!result) {
                return res.status(404).json({
                    message: 'property image not found'
                })
            }
            return res.status(201).json({
                message: 'property image deleted successfully'
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}
export {
    Create, GetAllProperty, GetAllNotPublishedProperty, GetAllPropertyWithParams, GetPropertyById, Edit, DeleteById,
    CreatePropertyImageByPropertyId, GetAllPropertyImagesByPropertyId, GetPropertyImageById, DeletePropertyImageById, DeleteAllPropertyImageById
}