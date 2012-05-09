/*
 *  title       : winston-couchdb
 *  author      : alan clarke
 *  created     : 9th May, 2012
 *  url         : http://alz.so
 *  description : a winston (https://github.com/flatiron/winston/) transport for couchdb (http://couchdb.apache.org/)
*/


var util     = require('util'),
    winston  = require('winston'),
    http     = require('http'),
    https    = require('https');


var defaults = {
  host       : 'localhost',
  port       : 5984,
  db         : 'log',
  //http auth
  user       : null,
  pass       : null,
  //ssl options, (see http://nodejs.org/api/https.html#https_https_request_options_callback)
  ssl        : false,
  key        : null,
  passphrase : null,
  cert       : null,
  ca         : null
};


var couchdb = winston.transports.couchdb = function(options) {

  this.name = 'couchdb';
  this.level = options.level || 'info';
  var settings = {};

  //create settings object, extending options with defaults
  Object.keys(defaults).forEach(function(i) {
    settings[i] = options[i] || defaults[i];
  });
  this.settings = settings;
};

util.inherits(couchdb, winston.Transport);


couchdb.prototype.log = function(level, msg, meta, callback) {

  //variable to capture response from couchdb
  var data = '';

  //data to be sent to couchdb
  var send_data = JSON.stringify({
    method  : 'log',
    params  : {
      timestamp : new Date(),
      msg       : msg,
      level     : level,
      meta      : meta
    }
  });

  //http.request options
  var options = {
    host    : this.settings.host,
    port    : this.settings.port,
    path    : '/'+this.settings.db.replace(/^\//i,''),
    agent   : this.settings.agent,
    method  : 'POST',
    headers : {
      'Content-Type'    : 'application/json',
      'Content-Length'  : send_data.length
    }
  };

  //additional ssl options
  if(this.settings.ssl){
    options.key        = this.settings.key || defaults.key;
    options.passphrase = this.settings.passphrase || defaults.passphrase;
    options.cert       = this.settings.cert || defaults.cert;
    options.ca         = this.settings.ca || defaults.ca;
  }

  //http.request authentication
  if(this.settings.user && this.settings.pass){
      options.auth = this.settings.user+':'+this.settings.pass;
  }

  //if ssl use the https library
  var req = (this.settings.ssl ? https : http).request(options, function(res) {
    res.on('data', function(d) {
      data += d;
    });
    res.on('end', function() {
      data = JSON.parse(data);
      return data.error ? callback(data.error) : callback(null, true);
      });
  });

  req.on('error', function(err) {
    callback(err);
  });


  req.write(send_data + '\n');
  return req.end();
};


module.exports = couchdb;