const mongoose = require('mongoose');

const ufoodSchema = mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	name: String
	calories: Number;
	carb: Number;
	fat: Number;
	protein: Number;
});

mondule.exports = mongoose.model('Ufood', ufoodSchema);