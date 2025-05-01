import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'
import {AuthMiddelware} from './Middlewares/AuthMiddelware.js'
import {RoleAuthMiddelware} from './Middlewares/RoleAuthMiddelware.js'
import UsersRouter from './Routes/usersRoutes.js'
import LoginRoute from './Routes/login.js'
import RegisterNormalUserRouter from './Routes/registerNormalUser.js'

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

app.use('/api/auth', LoginRoute)
app.use('/api/', RegisterNormalUserRouter)
app.use('/api/users',AuthMiddelware, RoleAuthMiddelware("admin"), UsersRouter)


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