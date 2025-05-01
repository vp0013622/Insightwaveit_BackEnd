import express from 'express'
import {Login} from '../Controllers/Authentication.js'


const LoginRoute = express.Router()
LoginRoute.post('/login', Login)

export default LoginRoute