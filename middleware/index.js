// this index.js is inside middleware directory
//we have given this file name index.js because when we require it where we need it then there we only have to mention the name of directory in which this file is present not the whole path because node itself finds index.js file.
// to require this file we have to give this path only ( var middleware= require("../middleware") )  not this  ( var middleware= require("../middleware/index.js") )


var Campground = require("../models/campground")
var Comment     = require("../models/comment")
var Review = require("../models/review");

//all the middleware codes
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req ,res ,next){                  // this middleware helps us to prevent a user who is not the author to delete,edit,addCampgrounds.
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
        if(err || !foundCampground){                                                //this line used here to handel the error so that our site dont crash if someone visits the edit campground page and changes one character of the campground id or shorters the id, to know more watch the video of Ian at lecture 6 if unit-38
            req.flash("error","Place not found")
            res.redirect("back")
        } else{
            //does user own the campground
            if(foundCampground.author.id.equals(req.user._id)){                   //this line is checking that the author and the loggedIn user is same or not
                  next()
            }  else{
                req.flash("error", "you dont have permission to do that")
                res.redirect("back")
            }
          
        }
    })
    } else{
        req.flash("error","You need to be loggedIn to do that") 
        res.redirect("back")         //this line redirect the user back to the last page he was in
        }
    }


middlewareObj.checkCommentOwnership = function(req ,res ,next){                  // this middleware helps us to prevent a user who is not the author to delete,edit,addCampgrounds.
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err || !foundComment){                                               //error handling
            req.flash("error","Comment not found") 
            res.redirect("back")
        } else{
            //does user own the comment
            if(foundComment.author.id.equals(req.user._id)){                   //this line is checking that the author and the loggedIn user is same or not
                  next()
            }  else{
                req.flash("error","You dont have permission to do that")
                res.redirect("back")
            }
          
        }
    })
    } else{
        req.flash("error","You need to be loggedIn to do that")
        res.redirect("back")         //this line redirect the user back to the last page he was in
        }
    }




middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate("reviews").exec(function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundCampground.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/campgrounds/" + foundCampground._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};




middlewareObj.isLoggedIn = function(req,res, next){        //this function checks that a user is logged in or not
    if(req.isAuthenticated()){
        return next()                                      //if he logged in take him to next step
    }
    req.flash("error","You need to be loggedIn to do that")               // this line will show a message if the user is not loggedIn and try to do something like addComments or AddCampgrounds etc, in this line 1st arg is the key and 2nd is the value, and this line should be used before redirecting to /login
    res.redirect("/login")                                //if not logged in redirect to /login page
}    



module.exports= middlewareObj;












































