const mongoose = require('mongoose');

var userItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },

  name: {
    type: String,
    match: /^[a-zA-Z ]{2,30}$/,
    required: [true, 'user name is required...!']
  },

  qty: {
    type: Number,
    required: [true, 'order qty is required...!']
  },

  amount: {
    type: Number,
    required: [true, 'user amount is required...!']
  },

  country: {
    type: String,
    required: [true, 'country is required...']
  },

  contact_info: {
    type: String,
    required: [true, 'contact info is required...']
  },
  payment: {
    type: String
  },
  
  //if payment used as master
  // payment: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'PaymentTypes'
  // },

  // payment result reference id given by the third party 
  paymentrefId: {
    type: String,
  },


  createddate: {
    type: String
  },

  createduser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  updateddate: {
    type: String
  },

  updateduser: {
    type: String
  },

  ItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Items'
  },
  isCancelled: {
    type: Boolean,
    default: false
  }
});


var paymentTypes = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },

  //payment name
  name: {
    type: String,
    match: /^[a-zA-Z ]{2,30}$/,
    required: [true, 'payment name is required...!']
  },

  //payment type
  type: {
    type: String,
    required: [true, 'payment type is required...!']
  },

  createddate: {
    type: Date,
    default: Date.now
  },

  createduser: {
    type: String
  },

  updateddate: {
    type: Date,
    default: Date.now
  },

  updateduser: {
    type: String
  }
});

mongoose.model('PaymentTypes', paymentTypes);
mongoose.model('UserProducts', userItemSchema);