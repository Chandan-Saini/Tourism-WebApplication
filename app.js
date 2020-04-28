// app.js file


var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    localStrategy    =require("passport-local"),
    methodOverride   = require("method-override"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    seedDB           = require("./seeds")


//requiring routes    
var commentRoutes    = require("./routes/comments") , 
        reviewRoutes     = require("./routes/reviews"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
   
var url= process.env.DATABASEURL || "mongodb://localhost:27017/tourism_v2"      //this line is used so that if our local server restarts or having some connection problem with the local env var then it can connect to the url given 
mongoose.connect(url)   //this line heping our app to connect to local DB server as well as hosted DB at mongodb atlas  




app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine","ejs")
app.use(express.static(__dirname + "/public"))        //this line is helping to use our .css file which is inside the public directory , here __dirname gives the current path in which this app.js is present that is (/home/ec2-user/environment/yelpCamp/v5) 
app.use(methodOverride("_method"))
app.use(flash())

//seedDB() 
// If you run into the Cannot read property 'name' of null  error, it's because now that we have the seeds function in app.js the campgrounds get deleted and recreated every time we start or restart the app.
// This means that, although they look the same, each campground has a brand new id in the database.
// If you want to avoid this error then you can either, comment out seedDB() in app.js or just be sure to go back to the campgrounds index page before going to any of the show pages.


app.locals.moment = require('moment');
//PASSPORT CONFIGURATION
app.use(require("express-session")({                         //requiring express-sessions
    secret: "once again rusty wins the cutest dog award",          // this line will be use to encode and decode the information in thesessions
    resave: false,
    saveUninitialized:false
}))
app.use(passport.initialize())      //these two lines tells express to use passport 
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())          //these two lines are used to read the session,taking data from session that is encoded and decoded
passport.deserializeUser(User.deserializeUser())

app.use(function(req , res, next){             //this function will be called for every route
    res.locals.currentUser = req.user          // if user is loggedIn then req.user will have his username and id
    res.locals.error = req.flash("error")    //this line also be called for every route to use flash with it to show error messages, remember the word error is only a key nothing else we can name it anything.
    res.locals.success = req.flash("success")    //this line also be called for every route to use flash with it to show success messages,remember the word success is only a key nothing else we can name it anything.
    next()
})








//this is the usage of express-router
app.use("/",indexRoutes)
app.use("/campgrounds",campgroundRoutes)      //here this line tells that start all the routes of campgroundRoutes with /campgrounds , we are doing this so that we dont have to write /campgrounds again and again when we define different routes.
app.use("/campgrounds/:id/comments",commentRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes);





//changes for tourism app
app.get("/siteplaces",function(req,res){
    res.render("campgrounds/siteplaces")
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("the tourism v2....... server has started")
})









































