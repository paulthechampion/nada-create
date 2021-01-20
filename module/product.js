const { Buffer } = require('buffer');
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    gender:{
        type:String,
        required:true,
    },
    description:{ 
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now,
    },
    productImage:{
        type: Buffer,
        required: true
    },
    productImageType:{
        type: String,
        required: true
    },
  
});

productSchema.virtual('prodImagePath').get(function(){
    if(this.productImage != null && this.productImageType != null){
        return `data:${this.productImageType}; charset=utf-8; base64,
         ${this.productImage.toString('base64')}`
    }
})


module.exports= mongoose.model('products', productSchema);
