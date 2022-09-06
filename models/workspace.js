const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    filename: {type: String, required: true, },
    filepath: {type: String, required : true},
}, {unique: true});

module.exports = mongoose.model('workspace', userSchema);