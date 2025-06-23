import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import {AuthMiddelware} from './Middlewares/AuthMiddelware.js'
import {RoleAuthMiddleware} from './Middlewares/RoleAuthMiddelware.js'
import { errorHandler } from './Middlewares/Handlers/ErrorHandler.js'
import UsersRouter from './Routes/usersRoutes.js'
import LoginRoute from './Routes/login.js'
import RegisterNormalUserRouter from './Routes/registerNormalUser.js'
import RolesRouter from './Routes/rolesRoutes.js'
import PropertyTypesRouter from './Routes/propertyTypesRoutes.js'
import UserAddressRouter from './Routes/userAddressRoutes.js'
import PropertyRouter from './Routes/propertyRoutes.js'
import { RolesModel } from './Models/RolesModel.js'
import { UsersModel } from './Models/UsersModel.js'

import path from 'path';
import { fileURLToPath } from 'url';
import UserProfilePictureRouter from './Routes/userProfilePictureRoutes.js'
import fs from 'fs';
import LeadsRouter from './Routes/leadsRoutes.js'
import FollowUpStatusRouter from './Routes/followUpStatusRoutes.js'
import LeadStatusRouter from './Routes/leadStatusRoutes.js'
import ReferenceSourceRouter from './Routes/referenceSourceRoutes.js'
import ContactUsRouter from './Routes/contactUsRoutes.js'

dotenv.config()
const PORT = process.env.PORT
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING
const SALT = 10 // Added salt rounds for bcrypt

const app = express()

// For serving uploaded images statically - MOVED TO TOP PRIORITY
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directories exist
const profileImagesDir = path.join(__dirname, 'profileImages');
const propertyImagesDir = path.join(__dirname, 'propertyImagesUploads');

// Create directories if they don't exist
if (!fs.existsSync(profileImagesDir)) {
    fs.mkdirSync(profileImagesDir, { recursive: true });
}
if (!fs.existsSync(propertyImagesDir)) {
    fs.mkdirSync(propertyImagesDir, { recursive: true });
}

//middle ware for parsing json request:
app.use(express.json())

//middle ware for cores policy: default * to allow all routes
app.use(cors());

// Static file serving - BEFORE ANY ROUTE HANDLERS
app.use('/profileImages', express.static(profileImagesDir));
app.use('/propertyImagesUploads', express.static(propertyImagesDir));

// Test route for checking image existence
app.get('/check-image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(profileImagesDir, filename);
    
    if (fs.existsSync(imagePath)) {
        res.json({
            exists: true,
            path: imagePath,
            size: fs.statSync(imagePath).size + ' bytes'
        });
    } else {
        res.status(404).json({
            exists: false,
            path: imagePath,
            error: 'Image not found'
        });
    }
});

//defult route.
app.get('/', (req, res)=>{
    return res.status(200).json({
        message: 'welcome to api'
    })
})
app.get('/api/', (req, res)=>{
    return res.status(200).json({
        message: 'welcome to api'
    })
})

// Error handling middleware should be LAST
app.use(errorHandler);

const createAdminRole = async () => {
    try {
        // Check if ADMIN role already exists
        const existingRole = await RolesModel.findOne({ name: "ADMIN" });
        if (existingRole) {
            return existingRole;
        }

        const newRole = {
            name: "ADMIN",
            description: "Super admin role with all privileges",
            createdByUserId: "system",
            updatedByUserId: "system",
            published: true
        }
        return await RolesModel.create(newRole);
    } catch (error) {
        throw new Error(`Error creating admin role: ${error.message}`);
    }
}

app.post('/api/tempSetup', async(req, res, next) => {
    try {
        // First create or get admin role
        const adminRole = await createAdminRole();
        
        // Check if admin user already exists
        const existingAdmin = await UsersModel.findOne({ email: "admin@gmail.com" });
        if (existingAdmin) {
            return res.status(400).json({
                message: 'Admin user already exists',
                data: { email: existingAdmin.email }
            });
        }

        const adminData = {
            email: "admin@gmail.com",
            firstName: "Temp",
            lastName: "Admin",
            password: "admin@123",
            phoneNumber: "+919185867888",
            role: adminRole._id
        }

        const hashedPassword = await bcrypt.hash(adminData.password, SALT);
        const newUser = {
            email: adminData.email,
            password: hashedPassword,
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            role: adminData.role,
            phoneNumber: adminData.phoneNumber,
            createdByUserId: "system",
            updatedByUserId: "system",
            published: true
        }

        const user = await UsersModel.create(newUser);
        
        // Don't send password in response
        const responseUser = { ...user.toObject() };
        delete responseUser.password;
        
        return res.status(200).json({
            message: 'Admin user created successfully',
            data: responseUser
        });

    } catch (error) {
        next(error); // Pass error to error handler
    }
});

app.get('/api/auth/check', AuthMiddelware, async(req, res)=>{
    res.status(200).json({
            message: 'Authenticated',
            data: true
    })
})

//file uploading
app.use('/api/file/userprofilepicture', AuthMiddelware, RoleAuthMiddleware("admin", "sales", "executive", "user", "saller"), UserProfilePictureRouter)
app.use('/api/contactus', ContactUsRouter)
app.use('/api/auth', LoginRoute)
app.use('/api/normaluser', RegisterNormalUserRouter)
app.use('/api/users',AuthMiddelware, UsersRouter)
app.use('/api/roles',AuthMiddelware, RolesRouter)
app.use('/api/useraddress',AuthMiddelware, UserAddressRouter)
app.use('/api/properytypes',AuthMiddelware, PropertyTypesRouter)
app.use('/api/property',AuthMiddelware, PropertyRouter)
app.use('/api/followupstatus',AuthMiddelware, FollowUpStatusRouter)
app.use('/api/leadstatus',AuthMiddelware, LeadStatusRouter)
app.use('/api/referancesource',AuthMiddelware, ReferenceSourceRouter)
app.use('/api/leads',AuthMiddelware, LeadsRouter)

// DB Connection with error handling
mongoose.connect(DB_CONNECTION_STRING)
.then((response)=>{
    console.log(`DB CONNECTED: ${response.connection.host}, ${response.connection.name}`)
    app.listen(PORT, (req, res)=>{
        console.log(`SERVER STARTED: ${PORT}`)
    })
})
.catch((error)=>{
    console.error('Database connection error:', error);
    process.exit(1);
});