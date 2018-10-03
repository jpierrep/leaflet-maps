var express=require("express");
var app=express();
var path=require('path');

app.set("view engine","jade");

app.get("/",function(req,res){
 
    var variable="variableeeee";
    var options=["a","b","c","d"];
    res.render("index",{variable:variable,opciones:options});


});

app.listen(8000,()=>{
    console.log("Servidor corriendo en puerto 8000")
});