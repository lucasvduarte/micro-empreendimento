const mongoose = require('mongoose');

const ProdutcSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    qtd: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
    }
});

const produtc = mongoose.model('Produtc', ProdutcSchema);
module.exports = produtc;