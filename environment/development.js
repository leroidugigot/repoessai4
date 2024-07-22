const path = require('path');

module.exports = {
  dbUrl: 'mongodb+srv://familleaitbella:123@clustermomo.5krbhd5.mongodb.net/?retryWrites=true&w=majority&appName=Clustermomo',
  cert: path.join( __dirname, '../ssl/local.crt'),
  key: path.join( __dirname, '../ssl/local.key'),
}