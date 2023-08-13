const express = require('express');
const router = express.Router();
//importing database
const {database} = require('../config/helpers')


/* GET all products. */
router.get('/', function(req, res) {
    let page=  req.query.page!==undefined && req.query.page!== 0  ? req.query.page: 1; //set the crrent page
    const limit =(req.query.limit!==undefined && req.query.limit!==0)? req.query.limit:10; //set the limit  of the items per page
    let startValue;
    let lastValue;
    if(page>0){
        startValue = (page*limit ) - limit ;
        lastValue = page* limit;
    }else{
        startValue = 0;
        lastValue = 10;
    }
//searching products in the database and give them back to user
    database.table('deals').getAll().then( deals=>{
        if(deals.length>0)
        {
            res.status(200).json({
                count:deals.length,
                deals:deals
            });
            console.log("success")
        }
        else{
            res.json({message:'No deals found'});
        }
    }).catch(err => console.log(err))
});

//get simple product
router.get('/:prodId', function(req,res
){ let productId = req.params.prodId;
    console.log(productId)
    let page=  req.query.page!==undefined && req.query.page!== 0  ? req.query.page: 1; //set the crrent page
    const limit =(req.query.limit!==undefined && req.query.limit!==0)? req.query.limit:10; //set the limit  of the items per page
    let startValue;
    let lastValue;
    if(page>0){
        startValue = (page*limit ) - limit ;
        lastValue = page* limit;
    }else{
        startValue = 0;
        lastValue = 10;
    }
    //searching products in the database and give them back to user
    database.table('deals').getAll().then( deals=>{
        let dealss= JSON.parse(JSON.stringify(deals))
        dealss.forEach((deal)=>{
            console.log(deal.id, productId)
            if(deal.id==productId)
            {
                res.status(200).json({
                    count:1,
                    products:deals
                });
                console.log("success")
            }
            else{
                res.json({message:'No deals found'});
            }
        })

    }).catch(err => console.log(err))

})




module.exports = router;
