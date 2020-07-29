var express = require('express');
var router = express.Router();
var multer      = require('multer');  
var path        = require('path');  

var empProfileimage=require('../models/product.model');

var ctrlUser = require('../controllers/user.controller');
var ctrlUserProduct = require('../controllers/userproduct.controller');
var ctrlProduct = require('../controllers/product.controller');


var jwtHelper = require('../config/jwtHelper');

//file handling

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
  });
  
  
  // Multer Mime Type Validation
  var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        empProfileimage.fileservice.fileurl=file.originalname
        if (['csv'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
  });

//products
router.post('/addproduct',jwtHelper.verifyJwtToken, upload.single('productfile'),ctrlProduct.addProducts);

//login and registration
router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);

// user orders
router.post('/createorder',jwtHelper.verifyJwtToken, ctrlUserProduct.createOrder);
router.post('/updateorder',jwtHelper.verifyJwtToken, ctrlUserProduct.updateOrder);
router.post('/cancelorder',jwtHelper.verifyJwtToken, ctrlUserProduct.cancelOrder);

// user orders filter
router.get('/getordersbydate/:orderdate',jwtHelper.verifyJwtToken, ctrlUserProduct.getOrdersByDate);
router.get('/getordersbyproduct/:noofproducts',jwtHelper.verifyJwtToken, ctrlUserProduct.getOrdersByProduct);
router.get('/getordersbyuser/:userid',jwtHelper.verifyJwtToken, ctrlUserProduct.getOrdersByUser);

module.exports = router;    



