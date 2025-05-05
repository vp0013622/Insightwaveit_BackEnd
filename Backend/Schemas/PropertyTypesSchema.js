import mongoose from "mongoose";
import * as dotenv from 'dotenv'

dotenv.config()
export const PropertyTypesSchema = mongoose.Schema(
    {
        typeName: {
          type: String,
          required: true,
          enum: ["APARTMENT", "HOUSE", "VILLA", "LAND", "COMMERCIAL"],
          unique: true
        },
        description: {
            type: String,
            required: true,
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