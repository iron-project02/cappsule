const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'There is no related user to this search'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: 'There is no related product to this search'
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Search', searchSchema);