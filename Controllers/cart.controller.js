const cartModel = require('../Models/cart.model')
const productModel = require('../Models/product.model')
const userRoleModel = require('../Models/userRoles.model')

exports.deleteCart = async(req,res)=>{
    
    try{
      
        const auth = await isAuthenticated(req.user)
        if(auth){
            
            const {cartId} = req.body
            const cart = await cartModel.findByIdAndDelete(cartId)
            if(!cart) return res.status(404).json({error:'Cart not found'})
            return res.status(200).json({ message:"cart deleted" , cart})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
     
}


exports.viewCart = async(req,res)=>{
    try{
        if(req.user){
            const userId = req.user.userID
            const cart = await cartModel.findOne({userId}).populate({
                path: 'products.productId', 
                model: 'Product' 
              });
            if(!cart) return res.status(404).json({error:'Cart not found'})
            
            return res.status(200).json(cart)
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
    
}
exports.viewCartDetails = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const {cartId} = req.query
            const cart = await cartModel.findById(cartId).populate({
                path: 'products.productId',
                model: 'Product'
              });
            if(!cart) return res.status(404).json({error:'Cart not found'})
            
            return res.status(200).json(cart)
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
exports.viewAllCarts = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const carts = await cartModel.find().populate({
                path: 'products.productId',
                model: 'Product'
              });
            if(!carts) return res.status(404).json({error:'Carts not found'})
            
            return res.status(200).json(carts)
        }
        else{
            return res.status(403).json({error: "access denied : user not allowed"})
        }
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
exports.updateCart = async (req, res) => {
    try {
      
        const userId = req.user.userID;
        const { productId, quantity } = req.body;
        
        if (!quantity) return res.status(400).json({ error: 'Quantity must be provided' });

        const product = await productModel.findById(productId);
        console.log("product", product);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            if (quantity > 0) {
                cart = new cartModel({ userId, products: [{ productId, quantity }] });
                await cart.save();
                return res.status(201).json(cart);
            }
            return res.status(404).json({ error: 'Cart not found' });
        }

        const existingProduct = cart.products.find(item => item.productId.toString() === productId.toString());

        if (existingProduct) {
            existingProduct.quantity += quantity;

            if (existingProduct.quantity <= 0) {
                cart.products = cart.products.filter(item => item.productId.toString() !== productId.toString());
            }
        } else if (quantity > 0) {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        return res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.removeProductFromCart = async (req, res) => {
    try {
        
        const userId = req.user.userID;
        const { productId } = req.body;

        const cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.products = cart.products.filter(item => item.productId.toString() !== productId.toString());

        await cart.save();
        return res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


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