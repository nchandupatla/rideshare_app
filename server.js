var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";
var ADS_COLLECTION = "ads";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server. 

//console.log('MONGODB_URI '+process.env.MONGOLAB_COBALT_URI);

mongodb.MongoClient.connect('mongodb://heroku_2vz7dl4c:eb5hk6qnrnd296fhv5d1ju0gtb@ds059306.mlab.com:59306/heroku_2vz7dl4c', function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Mongo Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}



app.get("/ads", function(req, res) {
  db.collection(ADS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get ads.");
    } else {
      res.status(200).json(docs);  
    }
  });
});


app.post("/insertAd", function(req, res) {
  var ad = req.body;
  ad.createdDate = new Date();
  console.log("Request document "+req.body);
  // if (!(req.body.title || req.body.fromLocation || req.body.toLocation  )) {
  //   handleError(res, "Invalid user input", "Must provide required fields.", 400);
  // }

  db.collection(ADS_COLLECTION).insertOne(ad, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new ad.");
    } else {
      console.log("Successfully inserted")
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

 app.get("/ads/:id", function(req, res) {
  db.collection(ADS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get ad");
    } else {
      res.status(200).json(doc);  
    }
  });
});

 app.put("/ads/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(ADS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update ad");
    } else {
      res.status(204).end();
    }
  });
});

 app.delete("/ads/:id", function(req, res) {
  db.collection(ADS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete ad");
    } else {
      res.status(204).end();
    }
  });
});

