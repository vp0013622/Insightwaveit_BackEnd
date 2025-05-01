import mongoose from "mongoose";

export const UsersSchema = mongoose.Schema(
    {
        email: {
          type: String,
          required: true,
          unique: true
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        password: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
          enum: ['ADMIN', 'SALES', 'EXECUTIVE', 'USER']
        },
        createdByUserId: {
          type: String,
          required: true
        },
        updatedByUserId:{
          type: String,
          required: true
        },
        published: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)