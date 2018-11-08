const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	name: {
		type: String,
		required: 'Product name most be defined',
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
	expirationDate: {
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
	pharmacy: {
		type: Schema.Types.ObjectId,
		ref: 'Pharmacy',
		//required: [true, `Pharmacy is needed`],
		//enum: [
		//	`Farmacia San Pablo`,
		//	`Farmacias del Ahorro`,
		//	`Farmacias Guadalajara`
		//],
		default: `5be26943ee041889b1c48eaa`
	},
	price: {
		type: Number,
		required: true
	},
},{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Product', productSchema);