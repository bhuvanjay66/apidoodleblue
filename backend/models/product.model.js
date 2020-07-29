const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },

  _pid: {
    type: String,
    unique:true,
    required: [true, 'item id is required']
  },
  pname: {
    type: String,
    required: [true, 'item name is required']
  },
  pdescription: {
    type: String,
    required: [true, 'item nadescriptionme is required']
  },
  pqty: {
    type: Number,
    required: [true, 'item qty is required']
  },
  psold: {
    type: Number,
    required: [true, 'item sold is required']
  },
  pprice: {
    type: String,
    required: [true, 'item price is required']
  },

  pcategory: {
    type: String,
    required: [true, 'item category is required']
  },

  pcreateddate: {
    type: Date,
    default: Date.now
  },

  pcreateduser: {
    type: String
  },

  pupdateddate: {
    type: Date,
    default: Date.now
  },

  pupdateduser: {
    type: String
  }
});

mongoose.model('Products', itemSchema);

module.exports.fileservice={
  fileurl:String
}