var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://admin:admin123@ds163530.mlab.com:63530/resume_yan';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;
var schema = new Schema({
	about: {title: String, paragraphs: [String]},
	experience: {title: String, jobs: [{heading: String, bullets: [String]}]},
	education_geekery: {title: String, bullets: [String]},
	contact: {
		title: String,
		contact: String
	}
});

module.exports = mongoose.model('NewResume', schema);
