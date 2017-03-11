global.base = `${__dirname}/src`;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const remejuan = require(`${global.base}/api`);

app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ipaddress', process.env.IP_ADDRESS || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/remejuan', remejuan);

app.get('/', (req, res) => res.sendStatus(200));

require('./src/bot');

const server = app.listen(app.get('port'), app.get('ipaddress'), () => {
  console.log('Express server listening on port ' + server.address().port);
});
