const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labSchema = new Schema({
	name: {
		type: String,
		required: 'Laboratory name most be defined'
	}
},{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Lab', pharmacySchema);