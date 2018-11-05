const mongoose              = require(`mongoose`),
      Schema                = mongoose.Schema,
      passportLocalMongoose = require(`passport-local-mongoose`),

userSchema = new Schema({
  username: {
    type:      String,
    required:  [true, `A phone number must be provided`],
    unique:    [true, `Phone number already registered`],
    min:       10,
    max:       10
  },
  email: {
    type:      String,
    required:  [true, `Email must be provided`],
    unique:    [true, `Email already registered`]
  },
  name: {
    type:      String,
    required:  [true, `Name must be provided`],
  },
  profile_pic: String,
  age:         {
    type:      Number,
    default:   0
  },
  gender: {
    type:      String,
    enum:      [`male`, `female`, `undefined`],
    default:   `undefined`
  },
  address: {
    type:      String,
    default:   ``
  },
  role: {
    type:      String,
    enum:      [`admin`, `user`],
    default:   `user`
  },
  facebookID: String,
  googleID:   String
},{
  timestamps: {
    createdAt: `created_at`,
    updatedAt: `updated_at`
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model(`User`, userSchema);