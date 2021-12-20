//jshint esversion:6
/////////////////////////////////////////////// This is a RESTful API ///////////////////////////////////////////////////

const express = require("express");
const body_parser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
//connect to mongoDB server and create database
mongoose.connect("mongodb://localhost:27017/wikiDB");

// to use body-parser
app.use(body_parser.urlencoded({
    extended: true
}));
// tell express to serve up the public folder as static resource
app.use(express.static("public"));
// set the view engine to ejs 
//this will assume a views directory containing an .ejs file
// refer to documentation ejs with express
app.set("view engine", "ejs");


const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.get("/", function(req, res) {
    res.send("hello mf");
});

/////////////////////////////////// REQUESTS TARGETING ALL ARTICLES ////////////////////////////////////////

// chained route handler of express
app.route("/articles")

.get(function(req, res) {

    Article.find({}, function(err, results) {
        if(!err) {
            console.log("all articles are sent");
            res.send(results)
        } else {
            console.log(err);
        }
    });
})

.post(function(req, res) {

    console.log(req.body.title + " " + req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err) {
        if(!err) {
            console.log("new article is created");
            res.send(newArticle);
        } else {
            console.log(err);
        }
    });

})

.delete(function(req, res) {

    Article.deleteMany({}, function(err) {
        if(!err) {
            console.log("all articles are deleted");
            res.send("All articles are deleted");
        } else {
            console.log(err);
        }
    });
});

///////////////////////////////////// REQUESTS TARGETING SPECIFIC ARITCLE //////////////////////////////////////////

app.route("/articles/:articleName")

.get(function(req, res) {

    Article.findOne({title: req.params.articleName}, function(err, result) {

        if(!err) {
            if(result) {
                console.log("article found and sent");
                res.send(result);
            } else {
                console.log("No article found");
                res.send("NO ARTICLE FOUND!!");
            }
        }
    });

})

.put(function(req, res) {

    // to use {overwrite: true} option use replaceOne
    // replaces the whole document
    Article.replaceOne(
        {title: req.params.articleName},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err) {

            if(err) {
                console.log(err);
            } else {
                console.log("article updated by put request");
                res.send("article is updated by put request");
            }

        });
})

.patch(function(req, res) {

    // only updates the document fields which the client has sent in the body of patch request
    Article.updateOne(
        {title: req.params.articleName},
        {$set: req.body},
        function(err) {

            if(err) {
                console.log(err);
            } else {
                console.log("article is updated by patch request.");
                res.send("article is updated by patch request.");
            }

        });
})

.delete(function(req, res) {

    Article.deleteOne(
        {title: req.params.articleName},
        function(err) {

            if(err) {
                console.log(err);
            } else {
                console.log("article deleted by delete request");
                res.send("article deleted by delete request");
            }

        });
});



app.listen(3000, function() {
    console.log("Server is running at port 3000");
});