import mongoose from "mongoose";
import * as dotenv from 'dotenv'

dotenv.config()
export const PropertyImagesSchema = mongoose.Schema(
    {
        propertyId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "PropertyModel",
        },
        fileName:{
          type: String,
          trim: true
        },
        imageData: {
          type: Buffer,
          required: true
        },
        mimeType: {
          type: String,
          required: true
        },
        createdByUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UsersModel",
          required: true,
          trim: true
        },
        updatedByUserId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "UsersModel",
          required: true,
          trim: true
        },
        published: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true,
    }
)