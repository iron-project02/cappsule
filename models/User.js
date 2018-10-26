const mongoose              = require(`mongoose`),
      Schema                = mongoose.Schema,
      passportLocalMongoose = require(`passport-local-mongoose`),

userSchema = new Schema({
  username: {
    type:      String,
    required:  [true, `A phone number must be provided`],
    unique:    [true, `Phone number already registered`],
    min:       8
  },
  email: {
    type:      String,
    required:  [true, `Email must be provided`],
    unique:    [true, `Email already registered`]
  },
  name:        String,
  profile_pic: String,
  age:         Number,
  gender: {
    type:      String,
    enum:      [`male`, `female`]
  },
  address:     String,
  role: {
    type:      String,
    enum:      [`admin`, `user`],
    default:   `user`
  }
},{
  timestamps: {
    createdAt: `created_at`,
    updatedAt: `updated_at`
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model(`User`, userSchema);