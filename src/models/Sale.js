const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produtc',
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

const sale = mongoose.model('Sale', SaleSchema);
module.exports = sale;