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

    const fileName = file.originalname;
    const imageUrl = `http://localhost:8080/profileImages/${fileName}`
    //const imageUrl = `https://insightwaveit-backend-p0cl.onrender.com/profileImages/${fileName}`; // Use IP if accessed from Flutter

    // Check if user already has a profile picture
    const existing = await UserProfilePictureModel.findOne({ userId });

    if (existing) {
      // Delete old image file from uploads folder
      const oldFilePath = path.join(__dirname, '../profileImages', existing.fileName);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Optionally remove DB entry (or you can update instead)
      await UserProfilePictureModel.deleteOne({ _id: existing._id });
    }

    // Save new record
    const newFile = {
      userId,
      fileName,
      url: imageUrl,
      createdByUserId: req.user?.id,
      updatedByUserId: req.user?.id,
      published: true,
    };

    const UserProfilePicture = await UserProfilePictureModel.create(newFile);

    return res.status(200).json({
      message: 'user profile picture added successfully',
      data: UserProfilePicture,
    });

  } catch (error) {
    //console.log(error.message,)
    return res.status(500).json({
      message: 'internal server error, while creating profile',
      error: error.message,
    });
  }
};


const GetAllUserProfilePicture = async (req, res) => {
    try {
        const userProfilePictures = await UserProfilePictureModel.find({ published: true });
        return res.status(200).json({
            message: 'all user profile pictures',
            count: userProfilePictures.length,
            data: userProfilePictures
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

        const { fileName = null, url = null, createdByUserId = null, updatedByUserId = null, published = null} = req.body

        let filter = {}

        if (fileName !== null) {
            filter.fileName = { $regex: fileName, $options: "i" }
        }

        if (url !== null) {
            filter.url = { $regex: url, $options: "i" }
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

        return res.status(200).json({
            message: 'all user profile picture',
            count: userProfilePicture.length,
            data: userProfilePicture
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
            data: userProfilePicture
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

    // Delete old file from uploads directory
    const oldFilePath = path.join(__dirname, '../profileImages', userProfilePicture.fileName);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
      console.log('Old profile picture deleted:', userProfilePicture.fileName);
    }

    // New image data
    const fileName = file.originalname;
    const imageUrl = `http://localhost:8080/profileImages/${fileName}`;
    //const imageUrl = `https://insightwaveit-backend-p0cl.onrender.com/profileImages/${fileName}`

    const updatedData = {
      userId: userProfilePicture.userId,
      fileName: fileName,
      url: imageUrl,
      createdByUserId: userProfilePicture.createdByUserId,
      updatedByUserId: req.user?.id || userId,
      published: true,
    };

    const result = await UserProfilePictureModel.findByIdAndUpdate(id, updatedData, { new: true });

    return res.status(200).json({
      message: 'User profile picture updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Edit error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
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
    Create, GetAllUserProfilePicture, GetAllUserProfilePictureWithParams, GetUserProfilePictureById, Edit, DeleteById
}