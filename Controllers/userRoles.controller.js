const userRoleModel = require('../Models/userRoles.model')

exports.createUserRole = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const userRole= await userRoleModel.create(req.body)
            res.status(201).json(userRole)
        }else{
            res.status(403).json({error: "access denied : user not allowed"})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.getUserRoles = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const userRole = await userRoleModel.find()
            res.status(200).json(userRole)
        }
        else{
            res.status(500).json({error: "access denied : user not allowed"})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
exports.deleteUserRole = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const {userRoleID} = req.body;
            if(!userRoleID) return res.status(404).json({error:'userRoleID is required'});
            const userRole = await userRoleModel.findByIdAndDelete(userRoleID)
            if(!userRole)
                return res.status(404).json({error:'user role not found'})
            res.status(200).json({ message: 'User Role deleted successfully', userRole })
        }
        else{
            res.status(403).json({error: 'access denied : user not allowed'})
        }
    
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
exports.updateUserRole = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        console.log(auth)
        if(auth){
            const {_id, name} = req.body;
            if(!_id) return res.status(404).json({error:'userRoleID is required'});
            const userRole = await userRoleModel.findByIdAndUpdate(_id, {name:name}, {new: true,runValidators:true})
            if(!userRole) return res.status(404).json({error:'User Role not found'})
                
            res.status(200).json({ message: 'User Role updated successfully', userRole })

        }
        else{
            res.status(403).json({error: 'access denied : user not allowed'})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
async function isAuthenticated(obj){
    const userRoleID = obj.userRole
    const userRole = await userRoleModel.findById(userRoleID)
    if(userRole.name === 'admin'){
        return true
    }
    else if(userRole.name === 'user'){
        return false
    }
}