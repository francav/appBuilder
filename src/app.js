var Validator = require('jsonschema').Validator;
var validator = new Validator();

var fs = require('fs');

let jsonRawSchema = fs.readFileSync('schema/datamodel_schema_0_0_1.json');
let jsonSchema = JSON.parse(jsonRawSchema);

let jsonRawData = fs.readFileSync('sample_data/data_sample_0_0_1.json');
let jsonData = JSON.parse(jsonRawData);

console.log(validator.validate(jsonData, jsonSchema));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  
  var dbo = db.db("mydb");
  
	dbo.createCollection("products", function(err, res) {
		if (err) throw err;
		console.log("Collection created!");
		dbo.collection("products").insertOne(jsonData, function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");
			dbo.collection("products").find({}).toArray(function(err, result) {
				if (err) throw err;
				console.log(result);
				dbo.collection("products").drop(function(err, delOK) {
					if (err) throw err;
					if (delOK) console.log("Collection deleted");
						db.close();
					});
			});
		});
	});
});