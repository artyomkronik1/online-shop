const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();
//importing database
const {database, connection} = require('../config/helpers')



// Signup Gateway
router.post('/',  (req, res) => {
    let n = req.body.name;
    let e = req.body.email;
    let p = req.body.password;
    var user={
        name:n,
        email:e,
        password:p,
    }
    var result = true;
    database.table('use').withFields('name', 'email', 'password').getAll().then( async users => {
        let userss = JSON.parse(JSON.stringify(users))
        // check if user exist already
        userss.map(user => {
            if (user.name == n && user.email == e) {
                result = false
            }
        })
        // if not exist so we have to add him
        if (result === true) {
            const salt = bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(p.toString(), 10);

            database.table('use').insert({
                name: n,
                email: e,
                password: hashedPassword

            })

            res.json({message: 'new user succesfuly signuped', success: true})
        }

        if (result === false) {
            res.json({message: 'user already exist', success: false})
        }
    })

});

module.exports = router