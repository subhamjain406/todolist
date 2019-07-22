//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://subhamjain406:Sj@7278461208@cluster0-bzkt7.mongodb.net/todolistDB', {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
  name : String
});

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
  name : "welcome to to do list"
});

const item2 = new Item({
  name:"hit the + button to add item"
});

const item3 = new Item({
  name:"<--- hit it to delete the item"
});

const defaultItems=[item1,item2,item3];

app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("successfully stored the defaultItems");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const itemAdd = new Item({
    name : itemName
  });
  itemAdd.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const checkedItem = req.body.checkBox;
  Item.findByIdAndRemove(checkedItem,function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  });
});

// app.get("/:postName",function(req,res){
//   let url = req.params.postName;
//   res.render("about");
// });

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });
//
// app.get("/about", function(req, res){
//   res.render("about");
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
