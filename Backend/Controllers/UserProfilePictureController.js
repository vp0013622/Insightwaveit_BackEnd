import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv'
import { UserProfilePictureModel } from "../Models/UserProfilePictureModel.js"
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Create = async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    // Validation
    if (!userId || !file) {
      return res.status(400).json({
        message: 'bad request',
      });
    }

    // Check if user already has a profile picture
    const existing = await UserProfilePictureModel.findOne({ userId });

    if (existing) {
      // Remove old profile picture from database
      await UserProfilePictureModel.deleteOne({ _id: existing._id });
    }

    // Save new record with image data in database
    const newFile = {
      userId,
      fileName: file.originalname,
      imageData: file.buffer, // Store the image buffer directly
      mimeType: file.mimetype, // Store the MIME type
      createdByUserId: req.user?.id,
      updatedByUserId: req.user?.id,
      published: true,
    };

    const UserProfilePicture = await UserProfilePictureModel.create(newFile);

    return res.status(200).json({
      message: 'user profile picture added successfully',
      data: {
        _id: UserProfilePicture._id,
        userId: UserProfilePicture.userId,
        fileName: UserProfilePicture.fileName,
        mimeType: UserProfilePicture.mimeType,
        createdByUserId: UserProfilePicture.createdByUserId,
        updatedByUserId: UserProfilePicture.updatedByUserId,
        published: UserProfilePicture.published,
        createdAt: UserProfilePicture.createdAt,
        updatedAt: UserProfilePicture.updatedAt
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: 'internal server error, while creating profile',
      error: error.message,
    });
  }
};


const GetAllUserProfilePicture = async (req, res) => {
    try {
        const userProfilePictures = await UserProfilePictureModel.find({ published: true });
        
        // Return image metadata without binary data
        const imageMetadata = userProfilePictures.map(img => ({
            _id: img._id,
            userId: img.userId,
            fileName: img.fileName,
            mimeType: img.mimeType,
            createdByUserId: img.createdByUserId,
            updatedByUserId: img.updatedByUserId,
            published: img.published,
            createdAt: img.createdAt,
            updatedAt: img.updatedAt
        }));

        return res.status(200).json({
            message: 'all user profile pictures',
            count: imageMetadata.length,
            data: imageMetadata
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const GetAllUserProfilePictureWithParams = async (req, res) => {
    try {

        const { fileName = null, createdByUserId = null, updatedByUserId = null, published = null} = req.body

        let filter = {}

        if (fileName !== null) {
            filter.fileName = { $regex: fileName, $options: "i" }
        }

        if (createdByUserId !== null) {
            filter.createdByUserId = createdByUserId
        }

        if (updatedByUserId !== null) {
            filter.updatedByUserId = updatedByUserId
        }

        if (published !== null) {
            filter.published = published;
        }

        const userProfilePicture = await UserProfilePictureModel.find(filter);

        // Return image metadata without binary data
        const imageMetadata = userProfilePicture.map(img => ({
            _id: img._id,
            userId: img.userId,
            fileName: img.fileName,
            mimeType: img.mimeType,
            createdByUserId: img.createdByUserId,
            updatedByUserId: img.updatedByUserId,
            published: img.published,
            createdAt: img.createdAt,
            updatedAt: img.updatedAt
        }));

        return res.status(200).json({
            message: 'all user profile picture',
            count: imageMetadata.length,
            data: imageMetadata
        })
    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const GetUserProfilePictureById = async (req, res) => {
    try {
        var { id } = req.params
        const userProfilePicture = await UserProfilePictureModel.findOne({userId: id})
        if (userProfilePicture == null) {
            return res.status(404).json({
                message: 'user profile picture not found',
                data: userProfilePicture
            })
        }
        return res.status(200).json({
            message: 'user profile picture found',
            data: {
                _id: userProfilePicture._id,
                userId: userProfilePicture.userId,
                fileName: userProfilePicture.fileName,
                mimeType: userProfilePicture.mimeType,
                createdByUserId: userProfilePicture.createdByUserId,
                updatedByUserId: userProfilePicture.updatedByUserId,
                published: userProfilePicture.published,
                createdAt: userProfilePicture.createdAt,
                updatedAt: userProfilePicture.updatedAt
            }
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
    const { userId } = req.body;
    const file = req.file;
    const { id } = req.params;

    if (!userId || !file || !id) {
      return res.status(400).json({ message: 'bad request' });
    }

    const userProfilePicture = await UserProfilePictureModel.findById(id);
    if (!userProfilePicture) {
      return res.status(404).json({ message: 'User profile picture not found' });
    }

    // Update with new image data
    const updatedData = {
      userId: userProfilePicture.userId,
      fileName: file.originalname,
      imageData: file.buffer, // Store the new image buffer
      mimeType: file.mimetype, // Store the new MIME type
      createdByUserId: userProfilePicture.createdByUserId,
      updatedByUserId: req.user?.id || userId,
      published: true,
    };

    const result = await UserProfilePictureModel.findByIdAndUpdate(id, updatedData, { new: true });

    return res.status(200).json({
      message: 'User profile picture updated successfully',
      data: {
        _id: result._id,
        userId: result.userId,
        fileName: result.fileName,
        mimeType: result.mimeType,
        createdByUserId: result.createdByUserId,
        updatedByUserId: result.updatedByUserId,
        published: result.published,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      },
    });
  } catch (error) {
    console.error('Edit error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const ServeProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userProfilePicture = await UserProfilePictureModel.findById(id);
    
    if (!userProfilePicture || !userProfilePicture.published) {
      return res.status(404).json({
        message: 'Profile image not found'
      });
    }

    // Set the appropriate headers for image serving
    res.set({
      'Content-Type': userProfilePicture.mimeType,
      'Content-Length': userProfilePicture.imageData.length,
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });

    // Send the image data
    res.send(userProfilePicture.imageData);
  } catch (error) {
    res.status(500).json({
      message: 'internal server error',
      error: error.message
    });
  }
};

const DeleteById = async (req, res) => {
    try {
        var { id } = req.params
        const userProfilePicture = await UserProfilePictureModel.findById(id)
        if (userProfilePicture == null) {
            return res.status(404).json({
                message: 'user profile picture not found',
                data: userProfilePicture
            })
        }
        userProfilePicture.updatedByUserId = req.user.id
        userProfilePicture.published = false
        const result = await UserProfilePictureModel.findByIdAndUpdate(id, userProfilePicture)
        if (!result) {
            return res.status(404).json({
                message: 'user profile picture not found'
            })
        }
        return res.status(201).json({
            message: 'user profile picture deleted successfully'
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
    Create, GetAllUserProfilePicture, GetAllUserProfilePictureWithParams, GetUserProfilePictureById, Edit, DeleteById, ServeProfileImage
}