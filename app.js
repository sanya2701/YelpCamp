var express = require("express");
var app = express(); 
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var methodOverride = require("method-override");
var Campground = require("./models/campgrounds");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var Comment = require("./models/comments");
var User = require("./models/user")

var commentRoutes = require("./routes/commentRoutes");
var campgroundRoutes = require("./routes/campgroundRoutes");
var indexRoutes = require("./routes/indexRoutes");

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
var port = 3000;
app.set("view engine","ejs");
app.use(express.static("public"));  
app.use(methodOverride("_method"));
 
//Passport Configuration
app.use(require("express-session")({
     secret:"Sanya",
     resave:false,
     saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(port,function(){
    console.log("YelpCamp app started");
});