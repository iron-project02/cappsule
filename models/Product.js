const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	name: {
		type: String,
		required: 'Product name most be defined'
	},
	image: {
		type: String,
		default: ''
	},
	code: {
		type: String
	},
	labId: {
		type: Schema.Types.ObjectId,
		ref: 'Lab',
		required: 'There is no related laboratory to this product'
	},
	ingredient: {
		type: String,
		required: 'Product active ingrediente most be defined'
	},
	presentation: {
		type: String
	},
	quantity: {
		type: Number
	},
	unity: {
		type: String,
		enum: ['Capsule', 'Tablet']
	},
	route: {
		type: String,
		enum: ['Oral', 'Topic', 'Otic', 'Oftalmic', 'Intramuscular', 'Intravenous']
	},
	lot: {
		type: String
	},
	expitationDate: {
		type: Date
	},
	patent: {
		type: Boolean
	},
	controlled: {
		type: Boolean,
		//required: 'Controlled status most be defined',
		default: true
	},
	formula: {
		type: Array
	},
	concentration: {
		type: Array
	},
	excipientCbp: {
		type: String
	},
	price: {
		type: Number
	},
},{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Product', productSchema);