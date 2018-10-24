const mongoose = require(`mongoose`),
      Schema   = mongoose.Schema,

kitSchema = new Schema({
  owner: {
    type:      Schema.Types.ObjectId,
    ref:       `User`,
    required:  [true, `Owner is required`]
  },
  name:        String,
},{
  timestamps: {
    createdAt: `created_at`,
    updatedAt: `updated_at`
  }
});

module.exports = mongoose.model(`Kit`, kitSchema);