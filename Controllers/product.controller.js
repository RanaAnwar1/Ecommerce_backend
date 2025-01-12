const productModel = require('../Models/product.model')
const categoryModel = require('../Models/category.model');
const userRoleModel = require('../Models/userRoles.model');
exports.createProduct = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const{name,description,price,gender,inventory,categoryId,subcategoryId,isActive,newArrival} = req.body
            
            const imageFiles = req.files.map((file) => file.filename);
            const category = await categoryModel.findById(categoryId);
            if(!category)
                return res.status(404).json({error: 'Category not found'})
            const subcategory = category.subcategories.id(subcategoryId);
            if(!subcategory)
                return res.status(404).json({error: 'Subcategory not found'})
            const product = await productModel.create({
                name,
                description,
                price,
                gender,
                inventory: JSON.parse(inventory),
                categoryId,
                subcategoryId, 
                isActive,
                newArrival,
                images: imageFiles,
            });
            res.status(201).json(product)
        }
        else{
            res.status(403).json({error: "access denied : user not allowed"})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.getProducts = async(req, res)=>{
    try{
        const products = await productModel.find(({ isDeleted: false}))
        res.status(200).json(products)
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.updateProduct = async(req,res)=>{
    try{
        
        const auth = await isAuthenticated(req.user)
        if(auth){
            const productData = JSON.parse(req.body.productData);
            const productID = req.body.productID;
            if(!productID) return res.status(404).json({error:'productId is required'});
            const retrievedProduct = await productModel.findById(productID);
            if (!retrievedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            if (Object.keys(productData).length === 0) {
                return res.status(400).json({ error: 'No fields provided to update' });
            }
            const newImages = req.files?.map((file) => file.filename) || [];
            let updatedImages = retrievedProduct.images || [];
            updatedImages = [...updatedImages, ...newImages].slice(0, 5);
           
            const updates = {
                name: productData.name,
                description: productData.description,
                price: productData.price,
                gender: productData.gender,
                inventory: {
                    total: productData.inventory.total,
                    sizes: productData.inventory.sizes
                },
                categoryId: productData.categoryId,
                subcategoryId: productData.subcategoryId,
                isActive: productData.isActive,
                newArrival: productData.newArrival,
                images: updatedImages
            };
    
            const product = await productModel.findByIdAndUpdate(productID,{ $set: updates },
                { new: true, runValidators: true });
            if(!product)
                return res.status(404).json({error:'Product not found'})
            res.status(200).json(product)
        }
        else{
            res.status(403).json({error: "access denied : user not allowed"})
        }
       
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.deleteProduct = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
             const {productId} = req.body
            
            const product = await productModel.findByIdAndUpdate(
                productId,
                { isDeleted: true, isActive: false},
                { new: true }
              );
             
              if (!product) {
                return res.status(404).json({ error: 'Product not found' });
              }
          
              res.status(200).json({product});
        }
       else{
        res.status(403).json({error: "access denied : user not allowed"})
       }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.getProductDetails = async(req,res)=>{
    try{
        const {productId} = req.query
        if(!productId) return res.status(404).json({error:'productId is required'});
        const product = await productModel.findById(productId)
        if(!product)
            return res.status(404).json({error:'Product not found'})
        res.status(200).json(product)
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