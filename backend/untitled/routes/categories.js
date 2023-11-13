const express = require('express');
const router = express.Router();
//importing database
const {database, connection} = require('../config/helpers')



// Signup Gateway
router.get('/', (req,res) => {

    var result = true;
    database.table('categories').withFields('title', 'id').getAll().then( categories=>{
        if(categories.length>0){
            res.json({message:'categories exists', success:true, categories})
        }

       else {
            res.json({message:'categories does not exist', success:false})
        }
    })

});

module.exports = router