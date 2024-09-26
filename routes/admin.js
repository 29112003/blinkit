require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const {validateAdmin} = require('../middlewares/admin')

const {adminModel} = require("../models/admin");
const {productModel} = require("../models/product");
const {categoryModel} = require("../models/category");
const { validateProduct } = require("../models/product");


if(
    typeof process.env.NODE_ENV !== undefined && 
    process.env.NODE_ENV !== 'DEVELOPMENT'
){
    router.get('/create', async function(req,res){
        try{let salt = await bcrypt.genSalt(11);
        let hash = await bcrypt.hash("admin", salt);

        let user = new adminModel({
            name:'keshav',
            email:'test@example.com',
            password:hash,
            role:'admin'
        })
        await user.save();
        let token = jwt.sign({email : 'test@example.com', admin : true}, process.env.JWT_KEY);
        res.cookie("token", token)
        res.send(user)}
        catch(err){
            res.send(err.message);
        }
    })
}

router.get('/login', function(req,res){
    console.log("in adminlogin get router")
    
    res.render('admin_login');
})

router.post('/login',async function(req,res){
    console.log("in admin login post stating router")
    let {email, password} = req.body;
    let admin = await adminModel.findOne({email});

    if(!admin){
        return res.send("this admin is valid")
    }
    let valid = await bcrypt.compare(password, admin.password);
    if(valid){
        let token = jwt.sign({email:"test@example.com", admin : true}, process.env.JWT_KEY);
        res.cookie("token", token);
    console.log("in admin login post ending router")

        res.redirect("/admin/dashboard")
    }


})
// here we need to check wether the person is valided or not
router.get('/dashboard',validateAdmin,async function(req,res){
    let prodcount  = await productModel.countDocuments();
    let categcount  = await categoryModel.countDocuments();

    res.render('admin_dashboard', {prodcount , categcount});  
})
router.get('/', function(req,res){

    res.send("fast")
})
router.get('/logout', validateAdmin, function(req,res){
    res.cookie("token", "");
    res.redirect("admin/login");
    
})
router.get('/products',validateAdmin,async function(req,res){

    const resultArray = await productModel.aggregate([
        {
            $group:{
                _id: "$category",
                products : {$push : "$$ROOT"},
            },
        },
        {
            $project:{
                _id : 0,
                category: "$_id",
                products : { $slice : ["$products", 10] },
            },
        },
    ])

    const resultObject = resultArray.reduce((acc, item)=>{
        acc[item.category] = item.products;
        return acc;
    },{});


    // let products = await productModel.find();
    res.render("admin_products",{products : resultObject});
})

module.exports = router