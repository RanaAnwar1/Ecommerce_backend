const categoryModel = require('../Models/category.model')
const userRoleModel = require('../Models/userRoles.model')

exports.createCategory = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const { name, subcategories } = req.body;
            const parsedSubcategories = subcategories ? JSON.parse(subcategories) : [];
            req.body.subcategories = parsedSubcategories
            req.body.image = req.file.filename
        
            const category = await categoryModel.create({
                name,
                image: req.body.image,
                subcategories: parsedSubcategories,
            });
           
            res.status(201).json(category)
        }
        else{
            res.status(403).json({error: "access denied : user not allowed"})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
    
}

exports.getCategory = async(req, res)=>{
    try{
        const category = await categoryModel.find({ isDeleted: false })
        res.status(200).json(category)
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
   
}

exports.updateCategory= async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const{_id, subcategories,...updates} = req.body
            const categoryID = _id
            if (subcategories) {
                try {
                    updates.subcategories = JSON.parse(subcategories);
                } catch (err) {
                    return res.status(400).json({ error: 'Invalid subcategories format' });
                }
            }
           
            const retrievedCategory = await categoryModel.findById(categoryID);
            
            if (!retrievedCategory) {
              return res.status(404).json({ error: 'Category not found' });
            }
            req.body.image = req.file.filename
            updates.image = req.file.filename;
            const category = await categoryModel.findByIdAndUpdate(categoryID,{$set: updates },{new: true , runValidation: true})
            res.status(200).json(category)
        }
        else{
            res.status(403).json({error: "access denied : user not allowed"})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }

}

exports.deleteCategory = async(req,res)=>{
    try{console.log("deleteCategorycallled")
        const auth = await isAuthenticated(req.user)
        if(auth){
            const {categoryID} = req.body
            console.log(categoryID)
            const category = await categoryModel.findByIdAndUpdate(
                categoryID,
                { isDeleted: true, isActive: false },
                { new: true }
              );
            if(category){
                res.status(200).json(category)
            }else{
                res.status(404).json({error: 'Category not found'})
            }
        }else{
            res.status(403).json({error: "access denied : user not allowed"})
        }

    }
    catch(err){
        res.status(500).json({error: err.message})
    }
    
}

exports.createSubCategory = async (req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const{categoryID,name} = req.body
            const category = await categoryModel.findById(categoryID)
        
            if(category){
                const isDuplicate = category.subcategories.some(
                    (subcategory) => subcategory.name.toLowerCase() === name.toLowerCase()
                );
            
                if (isDuplicate) {
                    return res.status(400).json({ error: 'Subcategory name must be unique' });
                }
                const newSubCategory = { name };
                category.subcategories.push(newSubCategory);
                await category.save()
                res.status(201).json(category)
            }
            else{
                res.status(404).json({error: 'Category not found'})
            }
        }
        else{
            res.status(403).json({error: "access denied : user not allowed"})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }

}
exports.getSubCategory = async (req,res)=>{
    try{
        const {categoryID} = req.query
        const category = await categoryModel.findById(categoryID)
        if(category){
            res.status(200).json(category.subcategories)
        }
        else{
            res.status(404).json({error: 'Category not found'})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }

}
exports.updateSubCatgeory = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const { categoryID, oldSubcategory, newSubcategory } = req.body;
            const category = await categoryModel.findById(categoryID)
            const subcategoryIndex = category.subcategories.findIndex(sub => sub.name === oldSubcategory);
            if (subcategoryIndex === -1) {
            return res.status(404).json({ message: 'Subcategory not found' });
            }
            category.subcategories[subcategoryIndex].name = newSubcategory;
            await category.save();
        
            res.status(200).json({ message: 'Subcategory updated successfully', category });
        }
        else{
            res.status(403).json({error: "access denied : user not allowed"})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
    
}
exports.deleteSubCategory = async(req,res) =>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const {categoryID, subCategoryname} = req.body
            console.log(req.body)
            const category = await categoryModel.findById(categoryID)
            console.log(category)
            category.subcategories = category.subcategories.filter(
                (sub) => sub.name !== subCategoryname
            );
            await category.save();
            res.status(200).json(category)
        }
        else{
            res.status(403).json({error: "access denied : user not allowed"})
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