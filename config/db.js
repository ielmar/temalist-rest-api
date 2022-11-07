var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "144.76.61.53",
  port: 3306,
  user: "temalist",
  password: "luR7LkAwyA5u4OyQ8ZSl",
  database: "temalist",
  insecureAuth: true,
});

connection.connect();

module.exports = connection;
