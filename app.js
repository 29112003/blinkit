const express = require('express');
const app = express()
const passport = require('passport')
const expressSession = require('express-session')
let path  = require('path')
const cookieParser= require('cookie-parser');

const indexRouter = require("./routes/index")
const authRouter = require("./routes/auth")
const adminRouter = require("./routes/admin")
const productRouter = require("./routes/product")
const categoriesRouter = require("./routes/category")
const usersRouter = require("./routes/user")
const cartRouter = require("./routes/cart")
const paymentRouter = require("./routes/payment")
const orderRouter = require("./routes/order")


require("dotenv").config();
require("./config/db")
require("./routes/payment")
require("./config/google_oauth_config")

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended:true }));

app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret:process.env.SESSION_SECRET
    })
)
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser()); 

app.use('/', indexRouter)
app.use('/admin', adminRouter)
app.use('/auth', authRouter)
app.use('/products', productRouter)
app.use('/categories', categoriesRouter)
app.use('/users', usersRouter)
app.use('/cart', cartRouter)
app.use('/payment', paymentRouter)
app.use('/order', orderRouter)

app.listen(3000, function(){
    console.log(`listening on ${process.env.port}`);
})