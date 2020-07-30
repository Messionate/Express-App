const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserModel = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    admin:{
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User',UserModel);

module.exports = User;

