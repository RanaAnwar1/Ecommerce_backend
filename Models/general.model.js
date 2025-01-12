const mongoDB = require('mongoose')

const GeneralSchema = mongoDB.Schema({
    about:{type:'string'},
    hours:{type:'string'},
    address:{type:'string'},
    phone:{type:'string'},
},{
    timestamps:true
});
const ContactSchema = mongoDB.Schema({
    name:{type:'string', required:true},
    email:{type:'string', required:true},
    message:{type:'string', required:true},
},{
    timestamps:true
});
const General = mongoDB.model('General', GeneralSchema);
const Contact = mongoDB.model('Contact', ContactSchema);

module.exports = { General, Contact };