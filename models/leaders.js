const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Leader = new Schema({

    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    abbr:{
        type:String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    featured:{
        type:Boolean,
        required:true
    }
})

let Leaders = mongoose.model('Leader',Leader);

module.exports = Leaders;