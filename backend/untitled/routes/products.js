const express = require('express');
const router = express.Router();
//importing database
const {database} = require('../config/helpers')
const {request} = require("express");


/* GET all products. */
router.get('/', function(req, res) {
    // products by properties on some category
    if(req.query.cat_id)
    {
        let request =  req.query
        console.log('RQ',req.query)
        let pro=[]
        if( request.cat_id !=0) {
            database.table('products').getAll().then(products => {
                let productss = JSON.parse(JSON.stringify(products))
                productss.forEach((product) => {
                    console.log(product.color)
                    // sort by sex
                    if (request.sex && request.cat_id == product.cat_id && product.sex == request.sex && !pro.includes(product)) {
                        pro.push(product)
                    }
                    if (request.size && request.cat_id == product.cat_id && product.size == request.size && !pro.includes(product)) {
                        pro.push(product)
                    }
                    if (request.length && request.cat_id == product.cat_id && product.size == request.length && !pro.includes(product)) {
                        pro.push(product)
                    }
                    if (request.material && request.cat_id == product.cat_id && product.material == request.material && !pro.includes(product)) {
                        pro.push(product)
                    }


                    if (request.color && request.cat_id == product.cat_id && product.color == request.color && !pro.includes(product)) {
                        pro.push(product)
                    }
                })
                res.status(200).json({
                    count: pro.length,
                    products: pro
                });
            })
        }
      else  if( request.cat_id ==0) {
            database.table('products').getAll().then(products => {
                let productss = JSON.parse(JSON.stringify(products))
                productss.forEach((product) => {
                    console.log(product.color)
                    // sort by sex
                    if (request.sex && product.sex == request.sex && !pro.includes(product)) {
                        pro.push(product)
                    }
                    if (request.size && product.size == request.size && !pro.includes(product)) {
                        pro.push(product)
                    }
                    if (request.length && product.size == request.length && !pro.includes(product)) {
                        pro.push(product)
                    }
                    if (request.material && product.material == request.material && !pro.includes(product)) {
                        pro.push(product)
                    }


                    if (request.color && product.color == request.color && !pro.includes(product)) {
                        pro.push(product)
                    }
                })
                res.status(200).json({
                    count: pro.length,
                    products: pro
                });
            })
        }
        //console.log(req.body)
    }
    else {
        let page = req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1; //set the crrent page
        const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; //set the limit  of the items per page
        let startValue;
        let lastValue;
        if (page > 0) {
            startValue = (page * limit) - limit;
            lastValue = page * limit;
        } else {
            startValue = 0;
            lastValue = 10;
        }
//searching products in the database and give them back to user
        database.table('products as p')
            .join([{
                table: 'categories as c',
                on: 'c.id = p.cat_id'
            }])
            .withFields(['c.title as category', '' +
            'p.title as name', 'p.price', 'p.quantity', 'p.image', 'p.description', 'p.id']).sort({id: .1}).getAll().then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
                console.log("success")
            } else {
                res.json({message: 'No products found'});
            }
        }).catch(err => console.log(err))
    }
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
    database.table('products as p')
        .join([{
            table: 'categories as c',
            on:'c.id = p.cat_id'
        }])
        .withFields(['c.title as category', '' +
        'p.title as name', 'p.quantity', 'p.price', 'p.description', 'p.image', 'p.id']).sort({id:.1}).getAll().then(prods =>{
        if(prods.length>0)
        {
            res.status(200).json({
                count:prods.length,
                products:prods
            });
            console.log("success")
        }
        else{
            res.json({message:'No products found'});
        }
    }).catch(err => console.log(err))

})


// getting product by search by name
router.get('/product/:prodName', function(req,res
){ let name = req.params.prodName;

    let finalprods =[]
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

    if(name.length>0) {
            //searching products in the database and give them back to user
            database.table('products as p').getAll().then(prods => {
                let prodss = JSON.parse(JSON.stringify(prods))

                if (prods.length > 0) {
                    prodss.forEach(prod => {
                        // products by name by each categoru
                        if (req.query.cat_id != 0 ) {
                            if (prod.title.toLowerCase().includes(name.toLowerCase()) && prod.cat_id == req.query.cat_id) {
                                finalprods.push(prod)
                            }
                        }
                        // all products by name
                        else {
                            if (prod.title.toLowerCase().includes(name.toLowerCase())) {
                                finalprods.push(prod)
                            }
                        }
                    })
                    if (finalprods.length > 0) {
                        res.status(200).json({
                            products: finalprods
                        });
                    } else {
                        res.json({message: 'No products found'});
                    }
                } else {
                    res.json({message: 'No products found'});
                }
            }).catch(err => console.log(err))
        }

})



//get all products from specific category
router.get('/category/:catName', function(req,res
){
    let cat_title = req.params.catName;
    console.log(cat_title)
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
    if(cat_title!='All products') {
        //searching products in the database and give them back to user
        database.table('products as p')
            .join([{
                table: 'categories as c',
                on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
            }])
            .withFields(['c.title as category', '' +
            'p.title as name', 'p.price', 'p.image', 'p.description', 'p.id']).sort({id: .1}).getAll().then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
                console.log("success")
            } else {
                res.json({message: 'No products found'});
            }
        }).catch(err => console.log(err))
    }
    // all products
    else{
        database.table('products as p').getAll().then(prods => {
            let prodss = JSON.parse(JSON.stringify(prods))
                      if (prodss.length > 0) {
                          res.status(200).json({
                              count: prodss.length,
                              products: prodss
                          });
                          console.log("success")
                      } else {
                          res.json({message: 'No products found'});
                      }
        })
    }
});


module.exports = router;
