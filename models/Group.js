const mongoose = require(`mongoose`),
      Schema   = mongoose.Schema,

groupSchema = new Schema({
  owner: {
    type:      Schema.Types.ObjectId,
    ref:       `User`,
    required:  [true, `Owner is required`]
  },
  members: [
    {
    type:      Schema.Types.ObjectId,
    ref:       `User`,
    }
  ]
},{
  timestamps: {
    createdAt: `created_at`,
    updatedAt: `updated_at`
  }
});

module.exports = mongoose.model(`Group`, groupSchema);