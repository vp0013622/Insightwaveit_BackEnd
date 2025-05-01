import jwt from "jsonwebtoken"

const AuthMiddelware = async(req, res, next)=>{
    let token;
    var authHeaders = ""
    authHeaders = req.headers.authorization
    if(!authHeaders){
        return res.status(500).json({
            message: 'access not granted',
        })
    }
    if(authHeaders && authHeaders.startsWith('Bearer ')){
        token = authHeaders.split(" ")[1]
        if(!token){
            return res.status(401).json({
                message: 'No token',
                data:{}
            })
        }
        try{
            var decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decodedToken //we put user in req param so we can use it further middelwares
            next()
        }
        catch(error){
            res.status(500).json({
                message: 'internal server error',
                error: error.message
            })
        }
    }
}



export{AuthMiddelware}