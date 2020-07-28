const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({

    name:{
        type: String,
        required: true,
        unique: true,
    },
    age:{
        type: Number,
        required: true,
        min: 12,
        max: 100
   },
   gender:{
        type: Boolean,
   }
},{
    timestamps: true
})

let Patient = mongoose.model('Patient',patientSchema);

module.exports = Patient;
