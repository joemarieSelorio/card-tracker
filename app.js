var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var indexRoutes = require("./routes/indexRoutes");
var nem = require("nem-sdk").default;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
});
