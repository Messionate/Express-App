const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Dishes = require('./dishes');

const favoriteSchema = new Schema({

	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	dishes:{
		type: [ {type : mongoose.Schema.Types.ObjectId, ref:'Dishes'} ]
	},

	},{
	timestamp:true
}) 

const Favorites = mongoose.model('Favorite',favoriteSchema);

module.exports = Favorites;
