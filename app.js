var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var mongoose  = require("mongoose");
var passport = require('passport');
var localStrategy = require('passport-local');
var transmittalRoute = require("./routes/transmittal");
var transmittalRoute = require("./routes/transaction");
var indexRoutes = require("./routes/indexRoute");
var indexRoutes = require("./routes/indexRoute");
var User = require("./model/user");
var methodOverride = require("method-override");
var port = 3300;

mongoose.connect("mongodb://localhost:27017/cardtracking", { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "EXPRESS!!!!!!!!!!!!!!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(indexRoutes);
app.use(transmittalRoute);

app.listen(port, function(){
    console.log("server started");
});



