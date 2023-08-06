var mysql = require('mysql2');

var pool = null;

var config = {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'une_incrip',
    port: 3306
};

pool = mysql.createPool(config);

function createConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, con) {
            if (err) {
                console.log(err)
                reject(err)
                if (con)
                    con.release();
                return
            }

            if (con) // It is not null
                resolve(con)

        })
    })
}

module.exports.createConnection = createConnection;