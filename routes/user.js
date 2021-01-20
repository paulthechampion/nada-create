const express = require('express');
const app = express();
const csurf = require("csurf")
const passport = require('passport')
const Order= require('../module/order')
const Cart= require('../module/cart')

const csrfProtection = csurf();
app.use(csrfProtection)

app.get('/profile',isLoggedIn,async(req,res)=>{
    try{
       let orders= await Order.find({user:req.user})

        let cart
        orders.forEach((order)=>{
            cart= new Cart(order.cart)
            order.items= cart.generateArray()
        })
         res.render('user/profile',{orders:orders});
     }catch{

    }
    
})
app.get('/logout',isLoggedIn,async(req,res)=>{
   try{
    await req.logout();
    res.redirect('/')
    }
    catch{
        res.redirect("/")
    }
})

app.use('/',notLoggedIn,(req,res,next)=>{
    next();
})

app.get('/signup', (req,res)=>{
    const message= req.flash('error')
    res.render('user/signup',
        {csrfToken: req.csrfToken(),
        message:message,
        hasErrors :message.length>0
    })
    
    });

app.post("/signup", passport.authenticate('local-signup',{
    failureRedirect:'/user/signup',
    failureFlash: true
}),(req,res)=>{
    if(req.session.oldUrl){
        const oldUrl =req.session.oldUrl
        req.session.oldUrl= null
        res.redirect(oldUrl);
    }else{
        res.redirect("/user/profile")
    }
})

app.get('/signin', (req,res)=>{
    const message= req.flash('error')
    res.render('user/signin',
        {csrfToken: req.csrfToken(),
        message:message,
        hasErrors :message.length>0
    })  
})

app.post("/signin",passport.authenticate("local-signin",{
    failureRedirect:'/user/signin',
    failureFlash: true
}),(req,res)=>{
    if(req.session.oldUrl){
        const oldUrl =req.session.oldUrl
        req.session.oldUrl= null
        res.redirect(oldUrl);
    }else{
        res.redirect("/user/profile")
    }
})




function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/')
}

function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next()
    }
    res.redirect('/')
}

module.exports= app;