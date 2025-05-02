import mongoose from "mongoose";
import * as dotenv from 'dotenv'

dotenv.config()
export const RolesSchema = mongoose.Schema(
    {
        name: {
          type: String,
          enum: ['ADMIN', 'SALES', 'EXECUTIVE', 'USER'],
          required: true,
          unique: true,
          trim: true
        },
        description: {
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