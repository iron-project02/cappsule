const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
	name: {
		type:			String,
		required:	[true, `Offer name is needed`]
	},
	alias: {
		type:			String,
		required: [true, `Alias is needed`],
		unique:		true
	},
	productId: {
		type: 		Schema.Types.ObjectId,
		ref: 			`Product`,
		required: 'There is no related product to this offer'
	},
	pharmacyId: {
		type: 		Schema.Types.ObjectId,
		ref: 			`Pharmacy`,
		required: 'There is no related pharmacy to this offer'
	},
	price: {
		type: 		Number,
		required: 'The product price is missing'
	},
	discount: {
		type: 		Number,
		required: [true, `Offer discount is needed`]
	},
	validity: {
		type: 		Date,
		required: 'Validity date is missing'
	},
	terms: 			String
},{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Offer', offerSchema);