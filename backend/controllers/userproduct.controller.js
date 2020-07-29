//status code
//200-OK
//402-errors in database data handling
//403-related to db uses like duplicate and not found
//405-Exception


const mongoose = require('mongoose');
const UserProducts = mongoose.model('UserProducts');
var Items = mongoose.model('Products');
//Create the Order
// This should call after the payment gateway
module.exports.createOrder = (req, res, next) => {
    try {
        console.log(req.body)
        var userproducts = new UserProducts();
        userproducts._id = new mongoose.Types.ObjectId(),
            userproducts.name = req.body.name,
            userproducts.amount = req.body.price,
            userproducts.contact_info = req.body.contact_info,
            userproducts.qty = req.body.qty,
            userproducts.country = req.body.country,
            userproducts.payment = req.body.paymenttype,
            userproducts.paymentrefId = req.body.paymentrefId,
            // here both the req.body._id or req._id can be used. 
            userproducts.createduser = req.body.userid
        userproducts.updateduser = req.body.userid
        userproducts.createddate = new Date().toDateString()
        userproducts.updateddate = new Date().toDateString()
        userproducts.ItemId = req.body.itemid

        userproducts.save((err, doc) => {
            if (err) {
                console.log(err)
                res.status(402).json({
                    "status": 'Invalid',
                    "message": 'Order cannot be processed'
                });
            }
            else {
                Items.findOne({ _id: req.body.itemid}, function (err, item) {
                    if (err) {
                        console.log(err)
                        res.status(402).json({
                            "status": 'Invalid',
                            "message": 'Order cannot be processed'
                        });
                    }
                    if (!item) {
                        res.status(403).json({
                            "status": 'Invalid',
                            "message": 'Item cannot be found'
                        });
                    }
                    // Verify and save the user
                    item.psold = req.body.qty;
                    item.save(function (err) {
                        if (err) {
                            console.log(err)
                            res.status(402).json({
                                "status": 'Invalid',
                                "message": 'Order cannot be processed'
                            });
                        }
                        else
                        {
                            return res.status(200).json({
                                "status": 'valid',
                                "message": 'Order processed successfully'
                            });
                        }
                    });
                });
                
            }

        });
    }
    catch (ex) {
        return res.status(405).send({ msg: ex.message });
    }
}

// update the order
module.exports.updateOrder = (req, res, next) => {
    try {
        console.log(req.body)
        // here both the req.body._id or req._id can be used. 
        UserProducts.findOne({ _id: req.body._id }, function (err, ordereduser) {
            if (err) {
                return res.status(402).json({
                    "status": 'Invalid',
                    "message": 'Issue in order'
                });
            }
            if (!ordereduser) {
                return res.status(403).json({
                    "status": 'Invalid',
                    "message": 'Order cannot be found'
                });
            }
            else {
                ordereduser.name = req.body.name,
                    ordereduser.amount = req.body.price,
                    ordereduser.contact_info = req.body.contact_info,
                    ordereduser.country = req.body.country,
                    ordereduser.payment = req.body.paymenttype,
                    ordereduser.qty = req.body.qty,
                    ordereduser.paymentrefId = req.body.paymentrefId,
                    // here both the req.body._id or req._id can be used. 
                    ordereduser.updateduser = req.body.userid
                ordereduser.updateddate = new Date();
                ordereduser.isCancelled = req.body.isCancelled,

                    ordereduser.ItemId = req.body.itemid
                ordereduser.save(function (err) {
                    console.log(err)
                    if (err) {
                        res.status(402).json({
                            "status": 'Invalid',
                            "message": 'Order cannot be updated'
                        });
                    }
                    else {
                        return res.status(200).json({
                            "status": 'valid',
                            "message": 'Order updated successfully'
                        });

                    }
                });
            }

        })
    }
    catch (ex) {
        console.log(ex)
        return res.status(405).send({ msg: ex.message });
    }
}

// cancel the order
module.exports.cancelOrder = (req, res, next) => {
    try {
        // here both the req.body._id or req._id can be used. .(i.e) req._id is return from
        //jwt verification

        UserProducts.findOne({ _id: req.body._id }, function (err, order) {
            if (err) {
                return res.status(402).json({
                    "status": 'Invalid',
                    "message": 'Issue in order'
                });
            }
            if (!order) {
                return res.status(403).json({
                    "status": 'Invalid',
                    "message": 'Order cannot be found'
                });
            }
            else {
                order.isCancelled = true;
                order.save(function (err) {
                    if (err) {
                        return res.status(402).json({
                            "status": 'Invalid',
                            "message": 'Order cannot be cancelled'
                        });
                    }
                    else {
                        return res.status(200).json({
                            "status": 'valid',
                            "message": 'Order cancelled successfully'
                        });
                    }
                });
            }
        });
    }
    catch (ex) {
        return res.status(405).send({ msg: ex.message });
    }
}


// get orders by customer
module.exports.getOrdersByUser = (req, res) => {
    try {
        console.log(req.params.userid)
        // here both the req.body._id or req._id can be used. .(i.e) req._id is return from
        //jwt verification
        UserProducts.aggregate([
            { "$match": { 'updateduser': req.params.userid } },
            {
                "$lookup": {
                    "from": "products",
                    "localField": "ItemId",
                    "foreignField": "_id",
                    "as": "productdetails"
                }
            },
            { $sort: { updateddate: -1 } }
        ]).exec(function (err, order) {
            console.log(order)
            console.log(err)
            if (err) {
                return res.status(402).json({
                    "status": 'Invalid',
                    "message": 'Issue in order'
                });
            }
            if (!order) {
                return res.status(403).json({
                    "status": 'Invalid',
                    "message": 'Order cannot be found'
                });
            }
            else {
                return res.status(200).json({
                    "status": 'valid',
                    "data": order
                });
            }
        });
    }
    catch (ex) {
        return res.status(405).send({ msg: ex.message });
    }
}

// get orders by date
module.exports.getOrdersByDate = (req, res) => {
    try {
        // here both the req.body._id or req._id can be used. .(i.e) req._id is return from
        //jwt verification
        console.log(new Date(req.params.orderdate).toDateString())
        UserProducts.aggregate([
            { "$match": { "createddate": new Date(req.params.orderdate).toDateString() } },
            {
                "$lookup": {
                    "from": "products",
                    "localField": "ItemId",
                    "foreignField": "_id",
                    "as": "productdetails"
                }
            },
            { $sort: { updateddate: -1 } }
        ]).exec(function (err, order) {
            if (err) {
                return res.status(402).json({
                    "status": 'Invalid',
                    "message": 'Issue in order'
                });
            }
            if (!order) {
                return res.status(403).json({
                    "status": 'Invalid',
                    "message": 'Order cannot be found'
                });
            }
            else {
                return res.status(200).json({
                    "status": 'valid',
                    "data": order
                });
            }
        });

    }
    catch (ex) {
        return res.status(405).send({ msg: ex.message });
    }
}


module.exports.getOrdersByProduct = (req, res) => {
    try {
        // here both the req.body._id or req._id can be used. .(i.e) req._id is return from
        //jwt verification
        console.log(req.params.noofproducts)
        UserProducts.aggregate([
            {
                "$lookup": {
                    "from": "users",
                    "localField": "createduser",
                    "foreignField": "_id",
                    "as": "users"
                }
            },
            { $sort: { updateddate: -1 } },
            {
                '$group': {
                    "_id": "$createduser",
                    'count': { '$sum': 1 },
                    'data': { '$addToSet': '$$ROOT' }
                }
            },
            {
                '$match': {
                    'count': { '$eq': Number(req.params.noofproducts) }
                }
            }
        ]).exec(function (err, order) {
            console.log(err)
            if (err) {
                return res.status(402).json({
                    "status": 'Invalid',
                    "message": 'Issue in order'
                });
            }
            if (!order) {
                return res.status(403).json({
                    "status": 'Invalid',
                    "message": 'Order cannot be found'
                });
            }
            else {
                return res.status(200).json({
                    "status": 'valid',
                    "data": order
                });
            }
        });
    }
    catch (ex) {
        return res.status(405).send({ msg: ex.message });
    }
}
