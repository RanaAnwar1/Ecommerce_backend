const userModel = require('../Models/users.model')
const userRoleModel = require('../Models/userRoles.model')
const hashing = require('../Utilitis/hashing')
const authentication = require('../Utilitis/authentication')
exports.createUser =async(req,res)=>{
    //for admin
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const{firstName,lastName,email,password,address,phoneNumber,roleId} = req.body
            const registeredUser = await userModel.findOne({email})
            if(!registeredUser){
                
                const hashedPassword = await hashing.hashPassword(password)
                const user = await userModel.create({firstName,lastName,email,password:hashedPassword,address,
                phoneNumber,roleId})
                return res.status(201).json(user)
            
            }
            else{
                return res.status(404).json({error: 'this email is registered already!'})
            }    
        }
        else{
            return res.status(403).json({error: "access denied : user not allowed"})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
exports.login = async(req,res)=>{
    //both user and admin
    try{
        const {email, password} = req.body
        const user = await userModel.findOne({email}).populate('roleId')
        if(user){
            const isMatched = await hashing.compare(password, user.password)
            if(isMatched){
                const token = authentication.createToken({userID: user._id,userRole:user.roleId})
                res.status(200).json({'accesstoken':token})
            }
            else{
                res.status(400).json({'not found':"wrong password"})
            }
        }
        else{
            res.status(400).json({'not found':"No User with this email is found"})
        }
        
    }
    catch(err){
        res.status(500).json({error: err.message})

    }
}

exports.getUsers = async(req,res)=>{
    //for admin
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            console.log(auth)
            const users = await userModel.find()
            res.status(200).json(users)
        }
        else{
            return res.status(403).json({error: "Unauthorized access"})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.registerUser = async (req,res)=>{
    //for normal users
    try{
        const{firstName,lastName,email,password,address,phoneNumber} = req.body
        const registeredUser = await userModel.findOne({email})
        if(!registeredUser){
            const userRole = await userRoleModel.findOne({ name: 'user' });
            if (!userRole) {
                return res.status(404).json({ error: "Role 'user' not found" });
            }
            else{
                const hashedPassword = await hashing.hashPassword(password)
                const user = await userModel.create({firstName,lastName,email,password:hashedPassword,address,
                phoneNumber,roleId:userRole._id})
                return res.status(201).json(user)
            }
        }
        else{
            return res.status(404).json({error: 'this email is registered already!'})
        }        
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.getUserDetails = async(req,res)=>{
    //both user and admin
    try{
        const {userId} = req.query
        console.log(userId)
        const user = await userModel.findById(userId)
        if(!user)
            res.status(404).json({error:'user not found'})
        else res.status(200).json(user)
        
    }
    catch(err){
        res.status(500).json({error: err.message})
    }

}
exports.updateUserProfile = async(req,res)=>{
    try{    
        const { _id, ...updates } = req.body;
        const userID = _id
        if(!userID) return res.status(404).json({error:'userID is required'})
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No fields provided to update' });
        }
        if(updates.password){
            const password = updates.password;
            const hashedPassword = await hashing.hashPassword(password)
            updates.password = hashedPassword
        }
        const user = await userModel.findByIdAndUpdate(userID,
            { $set: updates },
            { new: true, runValidators: true });
        if(!user)
            return res.status(404).json({error:'user not found'})
        res.status(200).json(user)
        
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.deleteUser = async(req,res) =>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const userID = req.body;
            if(!userID) return res.status(404).json({error:'userID is required'});

            const user = await userModel.findByIdAndDelete(userID)
            if(!user)
                return res.status(404).json({error:'user not found'})
            res.status(200).json({ message: 'User deleted successfully', user })
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