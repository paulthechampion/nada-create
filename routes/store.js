const express = require('express');
const app = express();
const Product = require('../module/product')
const Cart =require("../module/cart")
const Order = require("../module/order");


//const ilt = require("../assets/")

app.get('/', async(req,res)=>{
  
   /* let query= Product.find()
    if(req.query.name != null && req.query.name != ''){
      query= query.regex('title', new RegExp(req.query.title, 'i'))
    }*/
  const page= parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  const startIndex=(page-1)*limit
  const endIndex =page*limit

  

  const results={}
  
  if(endIndex< await Product.countDocuments().exec()){
    results.next={
      page:page+1,
      limit:limit
    }
  }

    if(startIndex >0){
    results.previous={
      page:page-1,
      limit:limit
    }
  }
  
    try{
       results.Productresults = await Product.find().limit(limit).skip(startIndex).exec()
      res.render('shop/store',{
        products:results.Productresults,
        searchOption: req.query,
        next:results.next,
        previous:results.previous,
  
      });
  
    }
    catch{
      res.redirect('/')
    }  
   
});

app.get('/add-to-cart/:id', async(req,res)=>{
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart:{});

  try{
    const products= await Product.findById(productId)
    cart.add(products, products.id, products.prodImagePath)
    req.session.cart=cart;
    //console.log(req.session.cart)
    res.redirect(`/store/${req.params.id}`)
  }catch (err){
    console.error(err)
  }
  

})

app.get("/reduce/:id",(req,res)=>{
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart:{});
req.session.cart=cart

  cart.reduceByOne(productId)
  if(cart.totalQty<=0){
    req.session.cart= null
  }  
  res.redirect("/store/cart")
})

app.get("/add/:id",(req,res)=>{
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart:{});
req.session.cart=cart

  cart.addByOne(productId)
  res.redirect("/store/cart")
})

app.get("/remove/:id",(req,res)=>{
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart:{});
req.session.cart=cart

  cart.removeItem(productId)
  if(cart.totalQty<=0){
    req.session.cart= null
  }  
  res.redirect("/store/cart")
})

app.get('/cart', (req,res)=>{
  if(!req.session.cart){
    return res.render('shop/cart',{products:null})
  }
  let cart = new Cart(req.session.cart);

  res.render('shop/cart',{products:cart.generateArray(), totalPrice: cart.totalPrice, subTotal:cart.subTotal})

})
  
app.get("/checkout", isLoggedIn,(req,res)=>{
  if(!req.session.cart){
    return res.redirect('/store/cart')
  }
  let cart = new Cart(req.session.cart);
  res.render('shop/checkout',{total:cart.totalPrice, cart:cart, user:req.user})

  
})

app.post("/checkout", isLoggedIn,async (req,res)=>{
  if(!req.session.cart){
    return res.redirect('/store/cart')
  }

 const name= req.body.firstName+" "+req.body.lastName
  
  let cart = req.session.cart
  const customerRef = req.body.customerRef
    const order= new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name:name,
      paymentId:customerRef
    })
  try{
    await order.save()
    
  }catch (err){
    console.err("error")
  }
})

app.get('/order/:id',(req,res)=>{
  req.session.cart =null
  res.render("shop/orders",{id:req.params.id})
})

app.get("/:id",async(req,res)=>{
  try{let product = await Product.findById(req.params.id)
  res.render("shop/preview",{product:product})
  }catch{
    res.redirect("/store")
  }
})



function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next()
  }
  req.session.oldUrl = `/store${req.url}`
  res.redirect('/user/signin')
}


function paginate(model){

  return async(req,res,next)=>{
    const page= parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex=(page-1)*limit
    const endIndex =page*limit

    const results={}

    if(endIndex<model.countDocuments().exec()){
    results.next={
      page:page+1,
      limit:limit
    }
  }

    if(startIndex >0){
    results.previous={
      page:page-1,
      limit:limit
    }
  }
    try{
    results.results = await model.find().limit(limit).skip(startIndex).exec
    }catch(e){
      res.status(500).json({message:e.message})
    }
    res.paginatedResults = results
    next()
  } 
}








module.exports= app;

