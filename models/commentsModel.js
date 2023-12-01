const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
},
{
    timestamp: true
});

module.exports = commentSchema;