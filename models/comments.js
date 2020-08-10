const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({

    rating:{
        type: Number,
        required: true,
        min:1,
        max:5
    },
    comment:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dish:{
    	type: mongoose.Schema.Types.ObjectId,
    	ref:'Dishes'
    }
},
    {
        timestamps: true
    }
);

const Comments = mongoose.model('Comment',commentSchema);

module.exports = Comments;

