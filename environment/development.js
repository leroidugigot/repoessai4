const path = require('path');

module.exports = {
  dbUrl: 'mongodb+srv://familleaitbella:123@clustermomo.5krbhd5.mongodb.net/test',
  cert: path.join( __dirname, '../ssl/local.crt'),
  key: path.join( __dirname, '../ssl/local.key'),
  portHttp: 3000,
  portHttps: 3001
}