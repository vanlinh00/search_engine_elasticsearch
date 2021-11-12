var client = require("./connection.js");
var express = require('express');
var app = express();
const path = require('path'); // Require library to help with filepaths

app.use(express.urlencoded({ extended: false })); // Middleware to recognize strings and arrays in requests
app.use(express.json()); // Middleware to recognize json in requests
app.use(express.static("public")); // Must have this or else access to index.js will 404
app.set("view engine", "ejs");
app.set("views", "./view");


app.get('/hinhanh', function (req, res) {
  console.log(req.query.id);

  if (req.query.id == "" || req.query.id == undefined) {
    res.render('test.ejs');
  }
  else {
    client.search({
      index: 'search-articles',
      type: 'articles',
      size: 100,
      body: {
        "query": {
          "match_phrase": {
            "description": { query: req.query.id, slop: 100 }
          }
        }
      }

    }).then(function (resp) {
      console.log("sdfgfdsSuccessful query! Here is the response:", resp.hits.hits[0]._source.description);
      // res.send(resp.hits.hits[0]._source.Title);
      res.render('search_img.ejs', { data: resp.hits.hits, key: req.query.id });
    }, function (err) {
      console.trace(err.message);
      res.send(err.message);
    });
  }
});

app.get('/moogle', function (req, res) {
  // res.render('test.ejs');
  console.log(req.query.search);
  /* Query using slop to allow for unexact matches */
  if (req.query.search == "" || req.query.search == undefined) {
    res.render('test.ejs');
  }
  else {
    client.search({
      index: 'search-articles',
      type: 'articles',
      size: 100,
      body: {
        "query": {
          "match_phrase": {
            "description": { query: req.query.search, slop: 100 }
          }
        }
      }

    }).then(function (resp) {


    //  console.log("sdfgfdsSuccessful query! Here is the response:", resp.hits);
  //    console.log("sdfgfdsSuccessful query! Here is the response:", resp.hits.hits[0]._source);
      // res.send(resp);
      res.render('search_key.ejs', { data: resp.hits.hits, key: req.query.search });

    }, function (err) {
      console.trace(err.message);
      res.send(err.message);
    });

  }

});

// Start listening for requests on port 3000
app.listen(3000, function () {
  console.log('App listening for requests...');
});

