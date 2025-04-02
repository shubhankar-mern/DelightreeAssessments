const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
});
customerSchema.index({ _id: 1 }, { unique: true });
module.exports = mongoose.model('Customer', customerSchema);