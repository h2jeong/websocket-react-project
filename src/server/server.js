const jsonServer = require('json-server');
const server = jsonServer.create();
// const router = jsonServer.router('argosCaptureMsg.json');
const middlewares = jsonServer.defaults();

// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileAsync');
// const adapter = new FileSync('argosCaptureMsg.json');
// exports.db = low(adapter);

const port = process.env.PORT || '3001';

server.use(middlewares);
// server.use(router);

server.listen(port, () => {
  console.log('JSON server is running');
});

require('./routes/socket')(server);

module.exports = server;
