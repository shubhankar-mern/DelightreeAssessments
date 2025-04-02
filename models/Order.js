const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: String,
    ref: 'Customer',
    required: true
  },
  products:{
    type: [{
      productId: {
        type: String,
        ref: 'Product',
      },
      quantity: {
        type: Number,
      },
      priceAtPurchase: {
        type: Number,
      },
    }],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
  },
});
orderSchema.index({ orderDate: 1 });
module.exports = mongoose.model('Order', orderSchema);