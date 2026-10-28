const fs = require('fs');
const os = require('os');
const path = require('path');
const jsonServer = require('json-server');
const auth = require('json-server-auth');
const seedDb = require('../server/db.json');
const routes = require('../server/routes.json');

const dbFile = path.join(os.tmpdir(), 'db.json');

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify(seedDb));
}

const app = jsonServer.create();
const router = jsonServer.router(dbFile);

app.db = router.db;
app.use(jsonServer.defaults({ logger: false, static: path.join(os.tmpdir(), 'public') }));
app.use(auth.rewriter(routes));
app.use(auth);
app.use(router);

module.exports = (req, res) => {
  req.url = req.url.replace(/^\/api(?=\/|\?|$)/, '') || '/';
  return app(req, res);
};
