const mongoDB = require('mongoose')

const AddressSchema = mongoDB.Schema({
  street: { type: String, required: true },
  floorNumber: { type: Number, required: true },
  apartmentNumber: { type: Number },
  city: { type: String, required: true },
  zipCode: { type: Number},
});
const OrderProductSchema = mongoDB.Schema({
    productId: { type: mongoDB.Types.ObjectId, required: true, ref: 'Product' },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
  });
  
  const OrderSchema = mongoDB.Schema({
    userId: { type: mongoDB.Types.ObjectId, required: true, ref: 'User' },
    products: { type: [OrderProductSchema], required: true },
    phoneNumber: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    deliveryDate: { type: Date, required: true },
    orderStatus: { type: String, required: true, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'] },
    totalBillAmount: { type: Number, required: true },
  },{
    timestamps:true
  });
module.exports = mongoDB.model('Order',OrderSchema)