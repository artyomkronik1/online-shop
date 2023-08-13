const express = require('express');
const router = express.Router();
//importing database
const {database, connection} = require('../config/helpers')



// Signup Gateway
router.post('/', (req, res) => {
    let n = req.body.name;
    let e = req.body.email;
    let p = req.body.password;
    var user={
        name:n,
        email:e,
        password:p,
    }
    var result = true;
    database.table('use').withFields('name', 'email', 'password').getAll().then( users=>{
        let userss= JSON.parse(JSON.stringify(users))
        userss.map(user=>{
            if(user.name==n && user.email ==e)
            {
                result = false
            }

        })
        if(result===true) {
            database.table('use').insert({
                name: n,
                email: e,
                password: p
            })
            res.json({message:'new user succesfuly signuped', success:true, user})
        }

        if(result===false) {
            res.json({message:'user already exist', success:false})
        }
    })

});

module.exports = router