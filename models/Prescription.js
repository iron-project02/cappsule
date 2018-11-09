const mongoose = require(`mongoose`),
      Schema   = mongoose.Schema;

prescriptionSchema = new Schema({
  userId: {
    type:      Schema.Types.ObjectId,
    ref:       `User`,
    required:  [true, `Owner is required`]
  },
	medicName:         String,
	prescription_pic:  [String],
  prescription_date: Date,
	treatmentId: {
		type:      [Schema.Types.ObjectId],
    ref:       `Treatment`,
    autopopulate: true
	},
},{
  timestamps: {
    createdAt: `created_at`,
    updatedAt: `updated_at`
  }
});

module.exports = mongoose.model(`Prescription`, prescriptionSchema);