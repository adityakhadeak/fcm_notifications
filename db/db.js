const { Pool } = require('pg')

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "2915",
    database: "fcm_notifications"//name of database
})
module.exports = pool