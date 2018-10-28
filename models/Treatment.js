const mongoose = require(`mongoose`),
      Schema   = mongoose.Schema,

treatmentSchema = new Schema({
  userId: {
    type:      Schema.Types.ObjectId,
    ref:       `User`,
    required:  [true, `Owner is required`]
  },
  productId: {
    type:      Schema.Types.ObjectId,
    ref:       `Product`,
    required:  [true, `Product is required`]
  },
  doctor:      String,
  frequency:   Number,
  dosage:      Number,
  start_date:  Date,
  end_date:    Date
},{
  timestamps: {
    createdAt: `created_at`,
    updatedAt: `updated_at`
  }
});

module.exports = mongoose.model(`Treatment`, treatmentSchema);