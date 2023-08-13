const MySqli = require('mysqli')
const mysql = require('mysql')
let conn = new MySqli({
        Host:'localhost',
        port:3306,
        user:'artiom',
        passwd:'123456',
        db:'web_shop'
})

let connection= mysql.createConnection =({
    Host:'localhost',
    port:3306,
    user:'artiom',
    passwd:'123456',
    db:'web_shop'
})

let db = conn.emit(false,'')
module.exports={
    database:db,
    connection:connection
};