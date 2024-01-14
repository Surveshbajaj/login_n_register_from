const localStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");


const User = require('../models/User');

module.exports= function(passport){
    passport.use(new localStrategy({usernameField: 'email'}, async(email, password, done) => {

        // Find the user by email address
        await User.findOne({
            email: email
          })
          
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'That email is not registered' });
            }

        // compare the plaintext password with the hashed one stored in the database
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                 return done(err); 
            }
            console.log(result);
            if (!result) {
                return done(null, false,{message:'Password incorrect'})
            } 
            else {
                 return done(null, user);
            }
        });
        
      }).catch((err)=>{console.log(err)});
    }
  ));
  // serialize and deserialize are used to turn users into the session and back
  passport.serializeUser((user, done) => {
    done(null, user.id);
    // console.log(user.id);s
  });
  
  passport.deserializeUser( async(id, done) =>{
    await User.findById(id)
    .then((user)=>{
        if(!user){
            return done(null, false);
        }
        done(null, user);
    })
    .catch((err) => {
        done(err);
    })
  });
};
