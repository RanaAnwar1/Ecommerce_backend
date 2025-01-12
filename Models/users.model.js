const mongoDB = require('mongoose');

const AddressSchema = mongoDB.Schema({
  street: { type: String, required: true },
  floorNumber: { type: Number, required: true },
  apartmentNumber: { type: Number },
  city: { type: String, required: true },
  zipCode: { type: Number},
});

const UserSchema = mongoDB.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: [AddressSchema], required: true },
  phoneNumber: { type: String, required: true, unique: true },
  roleId: { type: mongoDB.Types.ObjectId, required: true, ref: 'UserRole' },
},{
  timestamps:true,
});

module.exports = mongoDB.model('User', UserSchema);
