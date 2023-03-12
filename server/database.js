
const { Pool } = require('pg');

class BD {
    constructor(HOST, USER, DATABASE, PORT, PASSWORD){
        this.HOST = HOST
        this.USER = USER
        this.DATABASE = DATABASE
        this.PORT = PORT
        this.PASSWORD = PASSWORD
        this.conection = new Pool({
            host: HOST,
            user: USER,
            database: DATABASE,
            port: PORT,
            password: PASSWORD
        })
        }
}
module.exports = BD
