//import mongoose from 'mongoose';
const mongoose = require('mongoose');
//import { StringDecoder } from 'string_decoder';

const Schema = mongoose.Schema;

let Task = new Schema({
    task: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: Number,
        required: true,
        min: 0,
        max: 30
    },
    finished: {
        type: Boolean,
        default: false
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'Task',
        required: false
    }
});

//export default mongoose.model('Task', Task);
module.exports = mongoose.model('Task', Task);