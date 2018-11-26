const mongoose = require('mongoose');

const ufoodSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	date: { type: Date },
	image: { data: Buffer, contentType: String },
	label: { type: String} ,
	calories: { type: Number },
	carbs: { type: Number },
	fats: { type: Number },
	proteins: { type: Number }
});

module.exports = mongoose.model('Ufood', ufoodSchema);