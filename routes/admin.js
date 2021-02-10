const express = require('express');
const app= express();
const Product = require('../module/product')
const { Buffer } = require('buffer');
const imageMimeTypes= ['image/jpeg','image/png','image/gif'];
//all products 
app.get('/', async(req,res)=>{
  let query= Product.find()
  if(req.query.name != null && req.query.name != ''){
    query= query.regex('title', new RegExp(req.query.title, 'i'))
  }
 

  try{
    const products= await query.exec()
    res.render('admin/index',{
      products:products,
      searchOption: req.query
    });

  }
  
  catch{
    res.redirect('/')
  }
  
  
  
});



app.get('/new', async (req,res)=>{
  renderNewPage(res, new Product())
})

app.post('/', async (req,res)=>{
    // const fileName = req.file != null ? req.file.filename : null; 
     const product = new Product({
       name: req.body.name,
       gender:req.body.gender,
       description: req.body.description,
       price: req.body.price,
     })
     saveCover(product, req.body.cover)
     saveCoverBack(product, req.body.coverBack)
 
     try{
       const newProduct = await product.save();
       res.redirect(`/store`)
       
     }catch{
       renderNewPage(res,book, true)
     }
});

function saveCover(product, coverEncoded){
        if(coverEncoded== null) return
        const cover= JSON.parse(coverEncoded)
        if(cover != null && imageMimeTypes.includes(cover.type)){
            product.productImage = new Buffer.from(cover.data, 'base64')
            product.productImageType= cover.type
        }
}

function saveCoverBack(product, coverEncoded){
  if(coverEncoded== null) return
  const cover= JSON.parse(coverEncoded)
  if(cover != null && imageMimeTypes.includes(cover.type)){
      product.productImageBack = new Buffer.from(cover.data, 'base64')
      product.productImageType= cover.type
  }
}

      async function renderNewPage(res, product, hasError= false){
        renderFormPage(res,product,'new',hasError)
        };
  
      async function renderFormPage(res, product,form, hasError= false){
        try{
          
          
          const params={
            
            product:product
        }
        if(hasError){
          if(form==='edit'){
            params.errorMessage='Error Updating Book'
          }else {
            params.errorMessage='Error Creating Book'
          }
        }
        res.render(`admin/${form}`,params); 
        }catch{
          res.redirect('/admin/new');
        }
      };     

module.exports=app