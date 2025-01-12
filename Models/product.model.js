const mongoDB = require('mongoose')

const ProductSchema = mongoDB.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'] },
    inventory: { 
      total: { type: Number, required: true },
      sizes: [
        {
          size: { type: String, required: true },
          quantity: { type: Number, required: true },
        },
      ],
    },
    categoryId: { type: mongoDB.Types.ObjectId, required: true, ref: 'Category' },
    subcategoryId: { type: mongoDB.Types.ObjectId, ref: 'Category.subcategories' },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    newArrival: { type: Boolean, default: false },
},{
  timestamps:true
});
  
module.exports = mongoDB.model('Product', ProductSchema);
  