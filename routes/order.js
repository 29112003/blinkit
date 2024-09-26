const express = require('express');
const {paymentModel} = require("../models/payment")
const router = express.Router()

router.get("/:orderid/:paymentid/:signature",async (req,res)=>{
    let paymentDetails = await paymentModel.findOne({
        orderId : req.params.orderid
    })
    if(!paymentDetails) return res.send("sorry, this order does not exist");
    if(
        req.params.signature === paymentDetails.signature &&
        req.params.paymentid === paymentDetails.paymentid
    ){
        req.send("valid payment")
    }else{
        res.send("invalid payment")
    }
});



module.exports = router;