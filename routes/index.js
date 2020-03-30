//index.js file

var express     = require("express")
var router      = express.Router()
var passport    = require("passport")
var User        = require("../models/user")
var Campground = require("../models/campground")

//this is our root route
router.get("/",function(req,res){
    res.render("landing")
})



//===================================================
//AUTH ROUTES
//===================================================

//show register form
router.get("/register",function(req, res) {
    res.render("register")
})

//handle sign up logic
router.post("/register",function(req,res){
    var newUser= new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
        description: req.body.description
        
        })
        
    User.register( newUser , req.body.password , function(err,user){
        if(err){
            console.log(err);
                                                                                    //here we dont need to write our own message , if error came then we get message form JS that will be printed here
            return res.render('register',{error:err.message});                        //to know the meaning of these routes watch vid-5 unit-34
        } 
        passport.authenticate("local")(req,res, function(){
            req.flash("success","Welcome to TouriSum " + user.username)      //it will print message with the name of the user
            res.redirect("/campgrounds")
        })
    })
})




//show login form
router.get("/login",function(req, res) {
    res.render("login")            
})

//handling login logic
//here in the code below second argument is the middleware as app.post("/login", middleware ,callback)
router.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"   }) , function(req,res){
 })
 
 
 //logout route  
router.get("/logout", function(req, res) {
    req.logout()
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds")
})
 
// user profile
  router.get("/users/:id",function(req, res) {
      User.findById(req.params.id,function(err,foundUser){
          if(err){
              req.flash("error","Something went wrong")
              return res.redirect("/");
          }
          Campground.find().where("author.id").equals(foundUser._id).exec(function(err,campgrounds){
              if(err){
              req.flash("error","Something went wrong")
              return res.redirect("/");
          }
                    res.render("users/show",{user:foundUser,campgrounds: campgrounds})

          })
          
      })
  })


module.exports = router 































