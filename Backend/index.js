import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'
import {AuthMiddelware} from './Middlewares/AuthMiddelware.js'
import {RoleAuthMiddleware} from './Middlewares/RoleAuthMiddelware.js'
import UsersRouter from './Routes/usersRoutes.js'
import LoginRoute from './Routes/login.js'
import RegisterNormalUserRouter from './Routes/registerNormalUser.js'
import RolesRouter from './Routes/rolesRoutes.js'
import PropertyTypesRouter from './Routes/propertyTypesRoutes.js'
import UserAddressRouter from './Routes/userAddressRoutes.js'
import PropertyRouter from './Routes/propertyRoutes.js'
import { RolesModel } from './Models/RolesModel.js'

dotenv.config()
const PORT = process.env.PORT
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING

const app = express()

//middle ware for parsing json request:
app.use(express.json())
//middle ware for cores policy: default * to allow all routes
app.use(cors());
//do not remove the below commented part
//custome cors configuration
// app.use(cors({
//     origin:'http://localhost:8080/',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], //now only this methods are allowed while link starting with "http://localhost:8080/"
//     allowedHeaders: ['content-type']
// }))

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

const addTempRole = async(req, res)=>{
    try {
        await addTempRole(req, res);
        const reqData = {
                name: "ADMIN",
                description: "",
                published: true
        }
        const newRole = {
            name: reqData.name,
            description: reqData.description,
            createdByUserId: "1",//req.user.id,
            updatedByUserId: "1",//req.user.id,
            published: true
        }
        const role = await RolesModel.create(newRole)
        return res.status(200);

    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

app.post('/api/tempSetup', async(req, res)=>{
    try {

        await addTempRole(req, res);
        var role = await RolesModel.findBy({name: "ADMIN"})
        const reqData = {
                email: "admin@gmail.com",
                firstName: "Temp",
                lastName: "Admin",
                password: "admin@123",
                role: role._id
        }
        const hashedPassword = await bcrypt.hash(reqData.password, SALT);
        const newUser = {
            email: reqData.email,
            password: hashedPassword,
            firstName: reqData.firstName,
            lastName: reqData.lastName,
            role: reqData.role,
            createdByUserId: "1",//req.user.id,
            updatedByUserId: "1",//req.user.id,
            published: true
        }
        const user = await UsersModel.create(newUser)
        user.password = reqData.password
        return res.status(200).json({
            message: 'temp user added successfully',
            data: user
        })

    }
    catch (error) {
        res.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
})

app.use('/api/auth', LoginRoute)
app.use('/api/normaluser', RegisterNormalUserRouter)
app.use('/api/users',AuthMiddelware, RoleAuthMiddleware("admin"), UsersRouter)
app.use('/api/roles',AuthMiddelware, RoleAuthMiddleware("admin"), RolesRouter)
app.use('/api/useraddress',AuthMiddelware, RoleAuthMiddleware("admin", "sales", "executive", "user", "saller"), UserAddressRouter)
app.use('/api/properytypes',AuthMiddelware, RoleAuthMiddleware("admin", "sales"), PropertyTypesRouter)
app.use('/api/property',AuthMiddelware, RoleAuthMiddleware("admin", "sales", "executive", "saller"), PropertyRouter)

// #region DB Connection
mongoose.connect(DB_CONNECTION_STRING)
.then((response)=>{
    console.log(`DB CONNECTED: ${response.connection.host}, ${response.connection.name}`)
    app.listen(PORT, (req, res)=>{
        console.log(`SERVER STARTED: ${PORT}`)
    })
})
.catch((error)=>{
    console.log(error)
})
// #endregion