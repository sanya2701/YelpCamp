var express = require("express");
var router = express.Router();
var Comment = require("../models/comments");
var Campground = require("../models/campgrounds");

router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
  cid = req.params.id;
  //console.log(req.user.username);
  Campground.findById(cid).populate("comments").exec(function(err,camp){
      res.render("comments/new",{camp:camp});
  });
});

router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
 var cid=req.params.id;
 var comm = req.body.comm;
 var comment = ({comm:comm});
 Comment.create(comment,function(err,comment){
     if(err){
         console.log(err);
     }else{
          comment.author.id=req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //console.log(comment);
          Campground.findById(cid,function(err,camp){
              camp.comments.push(comment);
              camp.save(function(err,campc){
              });
          });       
  }
 });
 res.redirect("/campgrounds/"+ cid);
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;