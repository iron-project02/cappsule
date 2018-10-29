const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
	productId: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: 'There is no related product to this offer'
	},
	pharmacyId: {
		type: Schema.Types.ObjectId,
		ref: 'Pharmacy',
		required: 'There is no related pharmacy to this offer'
	},
	price: {
		type: Number,
		required: 'The product price is missing'
	},
	discount: {
		type: Number,
	},
	validity: {
		type: Date,
		required: 'Validity date is missing'
	},
	terms: {
		type: String,
		required: 'Most have the offer terms'
	}
},{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Offer', offerSchema);