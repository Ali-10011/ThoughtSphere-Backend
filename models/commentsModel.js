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
});

module.exports = commentSchema;