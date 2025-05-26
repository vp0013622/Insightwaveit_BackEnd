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
        url:{
          type: String,
          trim: true
        },
        createdByUserId: {
          type: String,
          required: true,
          trim: true
        },
        updatedByUserId:{
          type: String,
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