const orderModel = require('../Models/orders.model')
const userModel = require('../Models/users.model')
const userRoleModel = require('../Models/userRoles.model')
const cartModel = require('../Models/cart.model')
const productModel = require('../Models/product.model')


exports.placeOrder = async (req, res) => {
    try {
        

        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized Access' });
        }

        const { address, phoneNumber } = req.body;

        if (!address || !phoneNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

       
        const cart = await cartModel.findOne({ userId: req.user.userID }).populate('products.productId');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        let totalBillAmount = 0;
        const orderProducts = [];

        
        for (const cartProduct of cart.products) {
            const product = cartProduct.productId;

            if (!product || product.isDeleted || !product.isActive) {
                return res.status(400).json({ error: `Product ${product.name} is no longer available` });
            }

            if (product.inventory.total < cartProduct.quantity) {
                return res.status(400).json({ error: `Insufficient inventory for ${product.name}` });
            }
            const productTotal = product.price * cartProduct.quantity;
            totalBillAmount += productTotal;
            orderProducts.push({
                productId: product._id,
                quantity: cartProduct.quantity,
                priceAtPurchase: product.price,
            });

            
            product.inventory.total -= cartProduct.quantity;
            await product.save(); 
        }

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        const order = new orderModel({
            userId: req.user.userID,
            products: orderProducts,
            phoneNumber,
            address,
            deliveryDate,
            orderStatus: 'Pending',
            totalBillAmount,
        });

        await order.save();
        await cartModel.findByIdAndDelete(cart._id);

        res.status(201).json({
            message: 'Order placed successfully',
            orderId: order._id,
            totalBillAmount,
        });
    } catch (err) {
        console.error('Error placing order:', err.message);
        res.status(500).json({ error: 'An error occurred while placing the order.' });
    }
};

exports.viewUserOrders = async(req,res)=>{
    try{
        if(req.user){
            const {userID} = req.query
            const order = await orderModel.find({userId: userID}).populate('products.productId')
            if(!order) return res.status(404).json({error:'No Orders Found'})
            return res.status(200).json(order)
        }
        else return res.status(401).json({error: 'Unauthorized Access'})
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
exports.viewAllOrders = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const orders = await orderModel.find()
            if(!orders) return res.status(404).json({error:'No Orders Found'})
            return res.status(200).json(orders)
        }
        else return res.status(401).json({error:'Access Denied'})
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
exports.updateOrderStatus = async(req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const {orderId ,status} = req.body
            const order = await orderModel.findByIdAndUpdate(orderId, {orderStatus: status}, { new: true, runValidators: true })
            if(!order) return res.status(404).json({error:'Order Not Found'})
                
            return res.status(200).json({message: 'Order Updated successfully',order})
        }
        else return res.status(401).json({error:'Access Denied'})
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
exports.deleteOrder = async(req,res)=>{
    try{
        console.log("delete order called")
        const auth = await isAuthenticated(req.user)
        if(auth){
            const {orderId} = req.body
            const order = await orderModel.findByIdAndDelete(orderId)
            if(!order) return res.status(404).json({error:'Order Not Found'})
                
            return res.status(200).json({message: 'Order deleted successfully', order})
        }
        else return res.status(401).json({error: 'Unauthorized Access'})
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
exports.getOrderDetails = async (req,res)=>{
    try{
        const auth = await isAuthenticated(req.user)
        if(auth){
            const {orderId} = req.query
            const order = await orderModel.findById(orderId).populate('products.productId')
            if(!order) return res.status(404).json({error:'Order Not Found'})
                
            return res.status(200).json(order)
        }
        else return res.status(401).json({error: 'Unauthorized Access'})
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