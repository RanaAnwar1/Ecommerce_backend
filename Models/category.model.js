const mongoDB = require('mongoose')


const SubcategorySchema = mongoDB.Schema({
    name: { type: String, required: true, unique: true },
});

const categorySchema = mongoDB.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String },
    subcategories: { type: [SubcategorySchema] },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
},{
    timestamps:true
})

  
module.exports = mongoDB.model('Category',categorySchema)