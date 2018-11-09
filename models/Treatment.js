const mongoose = require(`mongoose`),
      Schema   = mongoose.Schema,

treatmentSchema = new Schema({
  userId: {
    type:      Schema.Types.ObjectId,
    ref:       `User`,
    required:  [true, `Owner is required`],
    autopopulate: true
  },
  productName: {
    type:      String,
    required:  [true, `Product is required`],
  },
  dosage:      Number,
  frequency:   Number,
  days:        Number,
  start_date:  Date,
  end_date:    Date
},{
  timestamps: {
    createdAt: `created_at`,
    updatedAt: `updated_at`
  }
});

module.exports = mongoose.model(`Treatment`, treatmentSchema);