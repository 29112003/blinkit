const express = require('express');
const router = express.Router();

require("dotenv").config();

router.get('/', function (req, res){
    res.redirect("/products")
})

module.exports = router;
