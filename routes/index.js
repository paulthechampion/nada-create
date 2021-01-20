const express = require('express');
const app = express();
const Product = require('../module/product')

app.get('/', async(req,res)=>{
    let product
    try{
        product=await  Product.find().sort({createdAt:'desc'}).limit(10).exec()
       
    }catch{
        product=[]
    }
     res.render('home',{products:product});
    
    });





module.exports= app;