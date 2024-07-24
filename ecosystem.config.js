module.exports = {
  apps : [{
    script: './bin/www',
    watch: 'NODE_ENV:development ',
    autorestart : true,
    instances : '8'
  }, {
    script: './bin/www',
    watch: 'NODE_ENV:production',
    autorestart : true,
    instances : 'max'
  }],


};
