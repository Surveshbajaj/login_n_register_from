const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');








//user model
const User = require("../models/User");

const { forwardAuthenticated } = require('../config/auth');

router.get('/login',forwardAuthenticated, (req,res)=>{
    res.render("login");
})
router.get('/register', forwardAuthenticated, (req,res)=>{
    res.render("register");
})


//regisster handle
router.post('/register',async (req,res)=>{
    let {name, email, password, password2} = req.body;
    let errors = [];

    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all field'});
    }
    if(password !== password2){
        errors.push({msg: 'Password do not match'});
    }

    //check the length of password
    if(password.length < 6) {
        errors.push({msg:'Password should be at least 6 characters'});
    }

    if(errors.length > 0 ) {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2  
        });
    }
    else{
        await User.findOne({email:email}).then((user)=> {
            if(user) { 
                errors.push({msg : "Email is already registered"});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
                else{
                    const newUser = new User({
                        name, 
                        email, 
                        password
                    }); 
                 //hash password
                 bcrypt.genSalt(10 , (err, salt) => {   
                    bcrypt.hash(newUser.password , salt , async (err, hash) =>{
                        //if error occured while hashing
                        if(err) throw err;
                        //save this to database
                        newUser.password = hash;
                        await newUser.save().then((user)=>{
                            req.flash('success_msg', 'You are now registerd and can log in Please Log In');
                            // errors.push({msg: "You are sucessfully register! You can login now "});
                            res.redirect('/users/login'); 
                        })
                        .catch((err)=>{
                            console.log(err);

                        })
                    })
                });
            }
        })
     }
 });




//login handle
router.post("/login", (req,res,next)=> {
    passport.authenticate('local', {
        successRedirect : "/dashboard" ,
        failureRedirect : "/users/login" ,
        failureFlash : true 
        })(req,res,next);
    });



//Logout Handle  
router.get("/logout", (req,res)=> {
        req.logout(function(err){
            if(err) throw err;
            req.flash("success_msg","You are logged out");
            res.redirect("/users/login")
        });
        
     });



module.exports = router;