const mongoose = require('mongoose');
//Import schema in notes.js model
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user:{
        //using schema type
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' // Using the user model as a referece model
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true, 
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    },
  });
  module.exports = mongoose.model('notes', NotesSchema);