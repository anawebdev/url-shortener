var mongoose = require('mongoose');

// Links Schema

var linkSchema = mongoose.Schema({
    fullLink: {
        type: String,
        required: true
    },
    shortLink: {
        type: String,
        required: true
    }
})

var LinkInfo = module.exports = mongoose.model("Link", linkSchema, 'urls');