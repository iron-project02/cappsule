const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reminderSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: 'There is no related user to this reminder'
	},
	treatmentId: {
		type: Schema.Types.ObjectId,
		ref: 'Treatment'
	},
	inventoryId: {
		type: Schema.Types.ObjectId,
		ref: 'Inventory',
		required: 'There is no related inventory product to this reminder'
	},
	quantity: {
		type: Number,
		required: 'There is no quantity definded'
	},
	date: {
		type: Date,
		required: 'Remainder date most be defined'
	}	
},{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Reminder', reminderSchema);