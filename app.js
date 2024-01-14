const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const expressSession = require('express-session');
const flash = require('connect-flash');
const passport =require('passport');


//passport config
require('./config/passport')(passport);
//db
const db = require('./config/key').mongoURL;

mongoose.connect(db, {useNewUrlParser: true })
.then(()=> console.log("connected..."))
.catch(err=>console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

//Bodypraser
app.use(express.urlencoded({extended: false}));  

//expresssession
app.use(expressSession({
    secret:'secret key',
    resave:false,
    saveUninitialized:true
 }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());



//Flash
 app.use(flash());

//global vars
app.use((req,res,next)=>{
    //console.log(req.user);
    res.locals.success_msg= req.flash('success_msg');   
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error= req.flash('error');

    next(); 
});

//route
app.use('/', require('./router/index'));
app.use('/users', require('./router/user'));



  
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})