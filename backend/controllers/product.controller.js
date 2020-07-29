//status code
//200-OK
//402-errors in database data handling
//405-Exception


var mongoose = require('mongoose');
var csv = require('csvtojson');


const empProfileimageurl = require('../models/product.model');
var Items = mongoose.model('Products');


//Create the item

module.exports.addProducts = (req, res, next) => {
    try {
        csv()
            .fromFile('./uploads/' + empProfileimageurl.fileservice.fileurl)
            .then((jsonObj) => {


                for (var x = 0; x < jsonObj.length; x++) {
                    var Item = new Items();
                    Item._id = new mongoose.Types.ObjectId(),
                    temp = jsonObj[x].pId
                    Item._pid = temp;

                    temp = jsonObj[x].pCategory
                    Item.pcategory = temp;

                    temp = jsonObj[x].pName
                    Item.pname = temp;

                    temp = jsonObj[x].pDescription
                    Item.pdescription = temp;

                    temp = jsonObj[x].pQty
                    Item.pqty = temp;

                    temp = jsonObj[x].pSold
                    Item.psold = temp;

                    temp = jsonObj[x].pAmount
                    Item.pprice = temp;
                    Item.pcreateduser = req._id;
                    Item.pupdateduser = req._id;
                    Items.updateOne(
                        { _pid: Item._pid },
                        {
                            $set: {
                                pcategory: Item.pcategory,
                                pname: Item.pname,
                                pdescription: Item.pdescription,
                                pqty: Item.pqty,
                                psold: Item.psold,
                                pprice: Item.pprice,
                                pcreateduser: Item.pcreateduser,
                                pupdateduser: Item.pupdateduser,
                            }
                        },
                        { upsert: true },async(err, data)=> {
                            if (err) {
                                return res.status(402).send();
                            } else {
                                return res.status(200).send();
                            }
                        }
                    )

                }
            });

    }
    catch (ex) {
        return res.status(405).send({ msg: ex.message });
    }
}
