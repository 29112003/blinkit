const express = require('express');
const {paymentModel} = require("../models/payment")
const router = express.Router()
const {orderModel} = require("../models/order");
const cart = require('../models/cart');

router.get("/userid/:orderid/:paymentid/:signature",async (req,res)=>{
    let paymentDetails = await paymentModel.findOne({
        orderId : req.params.orderid
    })
    if(!paymentDetails) return res.send("sorry, this order does not exist");
    if(
        req.params.signature === paymentDetails.signature &&
        req.params.paymentid === paymentDetails.paymentId
    ){


        let cart = await cartModel.findOne({user : req.params.userid})

        orderModel.create({
            orderId: req.params.orderid,
            user:req.params.userid,
            products : cart.products,
            totalPrice: cart.totalPrice,
            status:"processing",
            payment:paymentDetails._id,
        })
        res.redirect(`/map/${req.params.orderid}`)
    }else{
        res.send("invalid payment")
    }
});
router.post("/address/:orderid",async (req,res)=>{
    let order = await orderModel.findOne({orderId : req.params.orderid})
    if ( !order)return res.send("Sorry, this order does not exist")
    if(!req.order.address) return res.send("you must provide an address")
    order.address = req.body.address;
    order.save();
    res.redirect("/")
});



module.exports = router;