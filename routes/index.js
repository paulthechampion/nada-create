const express = require('express');
const app = express();
const Product = require('../module/product')

app.get('/', async(req,res)=>{
    let product
    let showProduct
    let random = Math.random()*100.
   
    try{
        product=await  Product.find().sort({createdAt:'desc'}).limit(10).exec()
        showProduct = await Product.aggregate(([{$sample:{size:1}}]))
       
        
       
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