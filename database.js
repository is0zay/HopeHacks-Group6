const mysql = require('mysql2');
const connection = mysql.createConnection({
	host: 'localhost',
	database: 'hope_hacks6',
	user: 'root',
	password: 'password'
});

connection.connect(function(err) {
	if(err) {
		throw err;
	} else {
		console.log('MySQL Database is connected Successfully');
	}
});

module.exports = connection;