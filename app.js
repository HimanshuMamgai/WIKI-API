require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({extended : true}));

app.use(express.static("public"));

mongoose.connect(process.env.DB_URL, {useUnifiedTopology: true, useNewUrlParser : true});

const articleSchema = {
    title : String,
    content : String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res) {
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    });

    newArticle.save(function(err) {
        if(!err) {
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany(function(err) {
        if(!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if(foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.");
        }
    });
})

.put(function(req, res) {
    Article.replaceOne(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content}, 
        function(err) {
        if(!err){
            res.send("Successfully updated article.");
        } else {
            res.send(err);
        }
    });
})

.patch(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if(!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res) {
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if(!err) {
                res.send("Successfully deleted the corresponding article.");
            } else {
                res.send(err);
            }
        }
    );
});

const port = process.env.port || 3000;

app.listen(port, function() {
    console.log("Server is running on port " + port);
});