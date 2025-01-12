const mongoDB = require('mongoose')
const connect = async ()=>{
    await mongoDB.connect("mongodb://127.0.0.1:27017/Ecommerce")
    console.log("DB connected")
}

module.exports = connect;