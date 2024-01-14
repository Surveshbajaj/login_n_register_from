const mongoose = require("mongoose");
const userScheme = new mongoose.Schema({
    name: {
         type : String,
         required : true
    }, 
    email: {
         type : String ,
         required : true
    },  
    password: {
         type : String ,
         required : true
    },  
    data: {
         type : Date ,
         default : Date.now()
    },  
});

const User = mongoose.model('User', userScheme);

module.exports= User; 