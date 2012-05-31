winston-couchdb
===============

-  title       : winston-couchdb
-  author      : alan clarke
-  created     : 9th May, 2012
-  url         : http://alz.so

a couchdb transport for the nodejs async logging library winston
couchdb:	http://couchdb.apache.org
winston:	https://github.com/flatiron/winston


Usage
-----

### Install
	
	npm install https://github.com/alanclarke/winston-couchdb/tarball/master

### Initialisation

	//initialise winston and transport
	var winston = require('winston'),
	    couchdb = require('./winston-couchdb');
	    
	//add coucdh
	winston.add(couchdb, {
		host : 'localhost',
		port : 5984,
		db   : 'log',
		user : 'user',
		pass : 'password',
		ssl  : false
	});

	//remove other transports, if couch is all you're using
	winston.remove(winston.transports.Console);


	//test logging an error message
	winston.log('error', new Error('some message'));


options
-------
###couchdb server
- host       : 'localhost',
- port       : 5984,
- db         : 'log',

###http authentication
- user       : null,
- pass       : null,

###ssl options
(see http://nodejs.org/api/https.html#https_https_request_options_callback) for a description, these are passed to a nodejs https.request function
- ssl        : false,
- key        : null,
- passphrase : null,
- cert       : null,
- ca         : null