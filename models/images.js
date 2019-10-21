const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
	data : Buffer,
	url  : String,
	type : String
});

module.exports = mongoose.model('image', imageSchema);
