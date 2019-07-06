var express = require("express");
var router = express.Router();
var methodOverride = require("method-override");
var Campground = require("../models/campgrounds");

router.get("/campgrounds",function(req,res){
  Campground.find({},function(err,allCamp){
      if(err){
          console.log(err);
      }
      else{
          res.render("campgrounds/campgrounds",{campgrounds:allCamp,currentUser:req.user});
      }
  });
});

router.post("/campgrounds",function(req,res){
  var cname = req.body.campname;
  var cimage = req.body.campimage;
  var cdesc = req.body.campdesc;
  var campground=({name:cname,image:cimage,desc:cdesc});
  Campground.create(campground,function(err,newCamp){
      if(err){
          console.log(err);
      }
      else{
        newCamp.author.id = req.user._id;
        newCamp.author.username = req.user.username;
        newCamp.save();
        console.log(newCamp);
        res.redirect("/campgrounds");
      }
  });
});

router.get("/campgrounds/new",isLoggedIn,function(req,res){
  res.render("campgrounds/new");
});

router.get("/campgrounds/:id",function(req,res){
  var fid = req.params.id;
  Campground.findById(fid).populate('comments').exec(function(err,campId){
      res.render("campgrounds/show",{camp:campId});
  });
});

router.get("/campgrounds/:id/edit",checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,camp){
        if(err){
          console.log(err);
        }else{
          res.render("campgrounds/edit",{camp:camp});
        }
    });
});
 
router.put("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndUpdate(req.params.id,{
    $set: {
        name: req.body.campname,
        image: req.body.campimage,
        desc: req.body.campdesc
    }
  }, function(err,camp){
      if(err){
        console.log(err);
      }else{
        res.redirect("/campgrounds/" + req.params.id);
      } 
    }); 
});

router.delete("/campgrounds/:id/",checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err,blog){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/campgrounds/");
    }
 });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

function checkCampgroundOwnership(req,res,next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id,function(err,camp){
      if(err){
        res.redirect("back");
      }else{
        if(camp.author.id.equals(req.user._id)){
         next();
        }else{
          res.redirect("back");
        }
      }
  });
  }else{
  res.redirect("back");
}
}

module.exports = router;