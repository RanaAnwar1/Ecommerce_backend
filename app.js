const express = require('express')
const connectDB = require('./Config/db.config')
const userRouter = require('./Routers/users.router')
const userRoleRouter = require('./Routers/userRoles.router')
const productRouter = require('./Routers/product.router')
const categoryRouter = require('./Routers/category.router')
const cartRouter = require('./Routers/cart.router')
const orderRouter = require('./Routers/orders.router')
const generalRouter = require('./Routers/general.router')
const port = 3000
const app = express()
app.use(express.json())
const cors = require('cors');
app.use(cors())
app.use(cors({origin:'http://localhost:4200'}));
app.use('/images', express.static('./imgs'))
connectDB();

app.use('/user',userRouter)
app.use('/userRoles', userRoleRouter)
app.use('/product',productRouter)
app.use('/category',categoryRouter)
app.use('/orders',orderRouter)
app.use('/cart',cartRouter)
app.use('/general',generalRouter)


app.listen(port,()=>{
    console.log('Server started at port 3000')
})