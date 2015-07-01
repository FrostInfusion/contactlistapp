var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

app.use(bodyParser.json());

//checks for db connection errors
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log('Connected to DB');
});

mongoose.connect('mongodb://localhost:27017/contactlist',function(err){
	if(err) console.log(err);
});

var UserSchema = new Schema({
	name:   String,
	email:  String,
	number: String
});

var User = mongoose.model('contactlist', UserSchema);

app.use(express.static(__dirname + '/public'));

app.get('/contactlist', function(req, res) {

	User.find(function (err, rez) {
		if (err) return console.error(err);
		res.json(rez);
	});
});

app.post('/contactlist', function(req, res) {

	var usr = new User({ 
		name: req.body.name,
		email: req.body.email, 
		number: req.body.number
	});

	usr.save(function (err, fluffy) {
		if (err) return console.error(err);

	});

	User.find(function (err, rez) {
		if (err) return console.error(err);
		res.json(rez);
	});
});


app.delete('/contactlist/:id', function(req, res) {

	var id = req.params.id;

	User.findOneAndRemove({ _id: id }, function(err, user) {
		if (err) throw err;
	});

	User.find(function (err, rez) {
		if (err) return console.error(err);
		res.json(rez);
	});

});

app.get('/contactlist/:id', function(req, res) {
	var id = req.params.id;
	User.findOne({ _id: id },function (err, rez) {
		if (err) return console.error(err);
		res.json(rez);
	});
});

app.put('/contactlist/:id', function(req, res) {
	var id = req.params.id;

	User.findOneAndUpdate({ _id: id }, {name: req.body.name, email: req.body.email, number: req.body.number},function (err, rez) {
		if (err) return console.error(err);
		res.json(rez);
	});

});


app.listen(5000);
console.log('Server is running on port 5000');