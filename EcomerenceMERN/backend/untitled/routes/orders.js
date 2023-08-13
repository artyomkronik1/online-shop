const express = require('express');
const router = express.Router();
//importing database
const {database} = require('../config/helpers')


//get all orders
router.get('/', (req, res)=> {
    database.table('orders_details as od').join([{
        table:'orders as o',
        on:'o.id = od.order_id'
    },
        {   table:'products as p',
            on:'p.id = od.order_id'
        },
        {   table:'users as u',
            on:'u.id = o.user_id'
        },
    ]).withFields(['o.id', 'p.title as name', 'p.price', 'u.username']).getAll().then(orders =>{
        if(orders.length>0)
        {
            res.status(200).json(orders);
        }else{
            res.json({message:'no order found'})
        }
    }).catch(err=>console.log(err))
})


//get single order

router.get('/:id', (req, res)=>{

    const orderId=  req.params.id
    database.table('orders_details as od').join([{
        table:'orders as o',
        on:'o.id = od.order_id'
    },
        {   table:'products as p',
            on:'p.id = od.order_id'
        },
        {   table:'users as u',
            on:'u.id = o.user_id'
        },
    ]).withFields(['o.id', 'p.title as name', 'p.price', 'u.username']).filter([{'o.id':orderId}]).getAll().then(orders =>{
        if(orders.length>0)
        {
            res.status(200).json(orders);
        }else{
            res.json({message:'no order found'})
        }
    }).catch(err=>console.log(err))
})


//POST method - new order
router.post('/new',  (req, res)=>
{
    let {userId, products} = req.body;
    if(userId!==null && userId>0 && !isNaN(userId))
    {
        database.table('orders').insert({
            user_id:userId,

        }).then(newOrderid=>{

            if(newOrderid)
            {
                products.forEach(async(p)=>{
                    let data =  await database.table('products').filter({id:p.id}).withFields(['quantity']).get()
                    let inCart = p.incart
                    if(data.quantity>0){
                        data.quantity= data.quantity-inCart
                    }
                    if(data.quantity<0){
                        data.quantity=0
                    }else{
                        data.quantity=0

                    }
                //    insert order details
                    database.table('orders_details').insert([{
                       id:p.id,
                        product_id:p.id,
                        quantity:inCart
                    }]).then(newId=>{
                        database.table('products').filter({id:p.id}).update({
                            quantity:data.quantity
                        }).then(succesNum=>{

                        }).catch(err=>console.log(err))
                    }).catch(err=>console.log(err))
                })
            }else{
                res.json({message:'new order failed while adding order details', success:false})
            }
            res.json({message:'new order succesfuly added', success:true, orderId:newOrderid, products:products})

        }).catch(err=>console.log(err))
    }
    else{
        res.json({message:'New order failed', success:false})

    }
})


// Payment Gateway
router.post('/payment', (req, res) => {
    setTimeout(() => {
        res.status(200).json({success: true});
    }, 3000)
});

module.exports = router