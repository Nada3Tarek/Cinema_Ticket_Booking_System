const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum length is 6 characters']
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'ADMIN'],
      default: 'CUSTOMER'
    }
  },
  { timestamps: true }
);

// hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

// login static method
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) throw Error('incorrect email');

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) throw Error('incorrect password');

  return user;
};

module.exports = mongoose.model('User', userSchema);
