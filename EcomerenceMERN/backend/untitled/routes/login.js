const express = require('express');
const router = express.Router();
//importing database
const {database, connection} = require('../config/helpers')



// Signup Gateway
router.post('/', (req, res) => {
    let email = req.body.email;
    let pasword = req.body.password;
    var user={
        email:"",
        password:"",
        name:"",
    };
    var result = false;
    database.table('use').withFields('name', 'email', 'password').getAll().then( users=>{
        let userss= JSON.parse(JSON.stringify(users))
        userss.map(user=>{
            if(user.password==pasword && user.email ==email)
            {
                result = true
                user.name = user.name;
                user.password = user.password;
                user.email = user.email;
                res.json({message:'logged in suuccessfuly', success:true, user})
            }

        })
        if(result===false) {
            res.json({message:'user does not exist', success:false})
        }
    })

});

module.exports = router