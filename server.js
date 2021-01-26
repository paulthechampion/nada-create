if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express= require('express');
const app= express();
const expressLayouts= require('express-ejs-layouts');
const index= require('./routes/index');
const store= require('./routes/store');
const admin= require('./routes/admin');
const user = require('./routes/user')
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const session = require('express-session')
const passport = require("passport")
const flash = require("connect-flash")
const validator = require("express-validator")
const MongoStore = require("connect-mongo")(session)

app.set('view engine','ejs')
app.set('layout', 'layouts/layout');


app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({limit:"10mb", extended:false}))
app.use(expressLayouts);
app.use(express.static('assets'))
app.use(session({
    secret:"mysupersecret", 
    resave:false,
     saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection}),
    cookie:{maxAge:180 * 60 * 1000}
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(validator())

app.use((req,res,next)=>{
    res.locals.login= req.isAuthenticated();
    res.locals.session = req.session
    res.locals.loggedInUser = req.user
    next()
})

mongoose.connect(process.env.DATABASE_URL,{
    useUnifiedTopology:true, useNewUrlParser:true
});
require('./config/passport')
const db= mongoose.connection;
db.on('error',error=>console.error(error));
db.once('open',()=>console.log('Connected to mongoose'));



app.use('/', index )
app.use('/store', store)
app.use('/admin',admin)
app.use('/user',user)
console.log("Listening to Port 5000")
app.listen(process.env.PORT || 5000);