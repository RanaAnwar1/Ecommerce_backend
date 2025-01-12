const mongoDB = require('mongoose')

const CartProductSchema = mongoDB.Schema({
    productId: { type: mongoDB.Types.ObjectId, required: true, ref: 'Product' },
    quantity: { type: Number, required: true , min : 1},
});

const cartSchema = mongoDB.Schema({
    userId: { type: mongoDB.Types.ObjectId, required: true, ref: 'User' },
    products: { type: [CartProductSchema], required: true },
},{
    timestamps:true
});

module.exports = mongoDB.model('Cart',cartSchema)