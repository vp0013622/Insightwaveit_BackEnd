import mongoose from "mongoose";
import * as dotenv from 'dotenv'

dotenv.config()
export const UserProfilePictureSchema = mongoose.Schema(
    {
        userId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "UsersModel",
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