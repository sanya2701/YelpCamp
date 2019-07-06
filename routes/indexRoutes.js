var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/",function(req,res){
  res.render("campgrounds/landing");
});

//AUTH routes
//Register
router.get("/register",function(req,res){
  res.render("user/register");
});

router.post("/register",function(req,res){
User.register(new User({username:req.body.username}),req.body.password,function(err,user){
    if(err){
      console.log(err);
      return res.render("user/register");
    }else{
      passport.authenticate("local")(req,res,function(){ 
          res.redirect("/campgrounds");
      })
    }
  });
});

//Login
router.get("/login",function(req,res){
  res.render("user/login");
});
router.post("/login",passport.authenticate("local",{
successRedirect:"/campgrounds",
failureRedirect:"/login"
}) ,function(req,res){
});

//Logout
router.get("/logout",function(req,res){
   req.logout();
   res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

module.exports = router;