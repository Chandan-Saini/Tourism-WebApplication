//campgrounds.js file

var express = require("express")
var router  = express.Router()                     //here express router is including in our code that will help us in doing associations
var Campground =require("../models/campground")
var middleware= require("../middleware")

//INDEX - show all campgrounds
router.get("/",function(req,res){   //here the route used is /campgrounds but we make it reduce using some code that is present in app.js file at lien 58.
      var noMatch = null
     if(req.query.search){          //using this for search request
          const regex =new RegExp(escapeRegex(req.query.search),"gi")
      //get all campgrounds from DB
      Campground.find({name: regex},function(err,allcampgrounds){
          if(err){
              console.log(err)
          } else{
             
              if(allcampgrounds.length < 1){
                   noMatch ="No places match that query, please try again."
              }
               res.render("campgrounds/index",{campgrounds:allcampgrounds, noMatch: noMatch})
          }
      })
     }else{
    //get all campgrounds from DB
      Campground.find({},function(err,allcampgrounds){
          if(err){
              console.log(err)
          } else{
               res.render("campgrounds/index",{campgrounds:allcampgrounds,noMatch: noMatch })
          }
      })
     }
         })

//CREATE - add new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
    var name= req.body.name
    var price = req.body.price
    var image= req.body.image
    var desc = req.body.description
    var author ={
        id: req.user._id,
        username: req.user.username}
    var youtubeurl = req.body.youtubeurl
    
    var newCampground = {name: name, price:price, image: image, description:desc, author:author, youtubeurl:youtubeurl }
   
    //create a new campground and save to the DB
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err)
        } else{
            //redirect back to campgrounds page
            console.log(newlyCreated)
            res.redirect("/campgrounds")
        }
    })
    
})


//NEW- show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){                             //here the route is /campgrounds/new
    res.render("campgrounds/new")
})



//SHOW - shows more info about one campground
router.get("/:id",function(req,res){                            //here the whole route is /campgrounds/:id
    //find the campground with provided Id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){                       //this line used here to handel the error so that our site dont crash if someone clicks the more info button  and changes one character of the campground id or shorters the id, to know more watch the video of Ian at lecture 6 if unit-38
            req.flash("error","Campground not found")  
            res.redirect("back")
        } else{
            console.log(foundCampground)
            //render show template with that campground
             res.render("campgrounds/show",{ campground: foundCampground})
        }
    })
})



//EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res) {
        Campground.findById(req.params.id, function(err,foundCampground){              //we have removed code from here and we written that code in middleware so that we can use/include that code in other places         
             res.render("campgrounds/edit",{campground:foundCampground})
             })
             })
             
//UPDATE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){              // in this line first argument is the that we are finding, second arg is the data that we have to update in the found id, third is callack
        if(err){
         res.redirect("/campgrounds")
        } else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})


//DESTROY campground route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds")
        } else{
            res.redirect("/campgrounds")
        }
    })
})


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")
}






module.exports = router

































