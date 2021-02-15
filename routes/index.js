const express = require('express');
const app = express();
const Product = require('../module/product')

app.get('/', async(req,res)=>{
    let product
    let showProduct
    let random = Math.random()
   
    try{
        product=await  Product.find().sort({createdAt:'desc'}).limit(10).exec()
        showProduct = await Product.find({random:{$lt:random}}).limit(6).exec()
        if(showProduct.length === 0){
          showProduct = await Product.find({random:{$gt:random}}).limit(6).exec()
        }
       
        
       
    }catch{
        product=[]
    }
     res.render('home',{products:product,
                showProducts:showProduct});
        
    });

app.get("/coming-soon",(req,res)=>{
    res.render("coming-soon")
})



module.exports= app;