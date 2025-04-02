const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  }
});
productSchema.index({ _id: 1 }, { unique: true });
module.exports = mongoose.model('Product', productSchema);