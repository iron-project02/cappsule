const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
	kitId: {
		type: Schema.Types.ObjectId,
		ref: 'Kit',
		required: 'There is no related kit to this inventory'
	},
	//product: {
		productId: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: 'There is no related productId to this product'
		},
		quantity: {
			type: Number,
			default: 1
		}
	//}
},{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Inventory', inventorySchema);