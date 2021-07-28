
// app.get("/:customLink",function(req,res){
//     const customListName = _.capitalize(req.params.customLink);

//     List.findOne({name: customListName},function(err,foundList){
//          if(!err){
//              if(!foundList){
//                 // New List
//                 const list1 = new List({
//                     name: customListName,
//                     items: defaultItems
//                 });
//                 list1.save();
//                 // console.log(list1);
            
//                 res.redirect("/"+customListName);
//                 // console.log("not Exists");
//             }else{
//                 //Show existing list
//                 res.render("list",{
//                     listTitle: foundList.name,
//                     newItem: foundList.items
//                     });
//             // console.log("Exists");

//             }
//         }
//     });    
// });  

// app.post("/delete",function(req,res){
//     const checkedId = req.body.checkbox;
//     const listName = req.body.listname;

//     if(listName===day){
//         Item.deleteOne({_id : checkedId},function(err){
//             if(err){
//                 console.log(err);
//             }else{
//                 console.log("Deleted successfully");
//             }
//         });
//         res.redirect("/");
//     }else{
//         List.findOneAndUpdate({name:listName},{$pull: {items: {_id:checkedId}}}, function(err,foundList){
//             if(!err){
//                 res.redirect("/"+listName);
//             }
//         });
//     }
            
// });

// app.listen(process.env.PORT || 3000,function(){
//     console.log("Server running on port 3000");
// });

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname+"/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let itemList = ["Eat","Sleep","Repeat"];
// let workList = [];
//Modifying using MongoDB

mongoose.connect("mongodb+srv://admin-avoy:Test1999@cluster0.udqtl.mongodb.net/todolistDB",{useNewUrlParser:true});
// mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Welcome to your TodoList!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "Hit the checkbox to delete an item"
});

const defaultItems = [item1, item2, item3];

const day = date.getDay();

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {


  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
  });

});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list
        res.render("list", {
            listTitle: foundList.name,
            newListItems: foundList.items
        });
      }
    }
  });

});

app.post("/", function(req, res){

  const itemName = req.body.item;
  const listName = req.body.submit;

  const item = new Item({
    name: itemName
  });

  if (listName === day){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
