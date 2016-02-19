var mongoose = require('mongoose');

var entradaSchema = {
    title: { type: String, required: true },
    link: { type: String, match: /^http:\/\//i },
    code: { type: String},
    date: { type: Date, default: Date.now }
};

var schema = new mongoose.Schema(entradaSchema);

module.exports = schema;
module.exports.entradaSchema = entradaSchema;