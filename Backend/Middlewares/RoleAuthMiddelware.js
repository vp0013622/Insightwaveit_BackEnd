export const RoleAuthMiddelware = (...roles)=>{
    return (req, res, next)=>{
        if(!req.user || !req.user.role){
            return res.status(403).json({
                message: 'access denied user not found'
            })
        }
        if(!roles.includes(req.user.role.toLowerCase()) && !roles.includes(req.user.role.toUpperCase())){
            return res.status(403).json({
                message: 'access denied'
            })
        }
        next()
    }
}
