const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//importing database
const {database, connection} = require('../config/helpers')

// const match = await bcrypt.compare(pasword, passFromDb);



// Signup Gateway
router.post('/', (req, res) => {
    let email = req.body.email;
    let pasword = req.body.password;
    var result = false;
    database.table('use').withFields('name', 'email', 'password').getAll().then( users=>{
        let userss= JSON.parse(JSON.stringify(users))
        userss.map(async user => {
                if (user.email == email ) {
                   const match =  bcrypt.compareSync(pasword, user.password)
                    if(match) {
                        result = true
                        const returnUser = {
                            name:user.name,
                            happyday:user.happyday,
                            birthday:user.birthday
                        }
                        res.json({message: 'logged in suuccessfuly', success: true, user:returnUser})

                    }
                }

        })
        if(result===false) {
            res.json({message:'user does not exist', success:false})
        }
    })

});
module.exports = router