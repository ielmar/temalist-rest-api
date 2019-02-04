var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '***REMOVED***',
    port: 3306,
    user: 'temalist',
    password: 'password',
    database: 'temalist',
    insecureAuth: true
});

connection.connect();

module.exports = connection;