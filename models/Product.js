const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: 'Product name most be defined'
    },
    ingredient: {
        type: String,
        required: 'Product active ingrediente most be defined'
    },
    administration: {
        type: String,
        required: 'Product active substance most be defined'
    },


},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Offer', productSchema);