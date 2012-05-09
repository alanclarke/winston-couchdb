var assert = require('assert'),
   winston = require('winston'),
   couchdb = require(__dirname + '/../lib/winston-couchdb');



winston.add(couchdb,{
	//this test requires a couchdb instance running with the following parameters:
	host : 'localhost',
	port : 5984,
	db   : 'log', 
	user : "user",
	pass : 'pass'
});


winston.log('error', new Error('test'));