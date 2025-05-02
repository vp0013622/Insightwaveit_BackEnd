import mongoose from "mongoose";

export const UsersSchema = mongoose.Schema(
    {
        email: {
          type: String,
          required: true,
          unique: true,
          trim: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
        },
        password: {
          type: String,
          required: true
        },
        role: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RolesModel",
          // type: String,
          // enum: ['ADMIN', 'SALES', 'EXECUTIVE', 'USER'],
          required: true
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
            required: true,
        },
    },
    {
        timestamps: true,
    }
)