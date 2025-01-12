const mongoDB = require('mongoose')

const RoleSchema = mongoDB.Schema({
    name: { type: String, required: true, unique: true },
},{
    timestamps:true
});
  
module.exports = mongoDB.model('UserRole',RoleSchema)