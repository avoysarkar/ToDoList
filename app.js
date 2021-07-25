const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();

app.set('view engine', 'ejs');

let itemList = ["Eat","Sleep","Repeat"];
let workList = [];

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){

    const day = date.getDay();
    //for sending data to ejs template
    res.render("list",{
        listTitle:day,
        newItem: itemList
    });

});

app.post("/",function(req,res){
    let item = req.body.item;

    if(req.body.submit === "Work List"){
        workList.push(item);
        res.redirect("/work");        
    }else{
        itemList.push(item);
        res.redirect("/");    
    }
});

app.get("/work",function(req,res){
    res.render("list",{
        listTitle:"Work List",
        newItem: workList
    });
});

app.post("/work",function(req,res){
    let item = req.body.item;
    workList.push(itemW);
    res.redirect("/work");        
});

app.listen(3000,function(){
    console.log("Server running on port 3000");
});