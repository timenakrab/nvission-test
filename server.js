const express = require('express');
const nextJS = require('next');
const fs = require('fs');
const useragent = require('express-useragent');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = nextJS({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT;

app
  .prepare()
  .then(() => {
    const server = express();
    server.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', `http://127.0.0.1:${port}`);
      res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Option, Authorization');
      next();
    });

    server.use(useragent.express());
    server.use((req, res, nextFlow) => {
      try {
        decodeURIComponent(req.path);
      } catch (e) {
        return res.status(404).send('Not found');
      }
      return nextFlow();
    });
    server.use(bodyParser.json({ limit: '50mb' }));
    server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    server.get('/robots.txt', (req, res) => {
      res.type('text/plain');
      const fileContent = fs.readFileSync('./robots.txt', 'utf8');
      res.send(fileContent);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });
    server.listen(port, (err) => {
      if (err) throw err;
      // eslint-disable-next-line no-console
      console.log(`> Ready on http://127.0.0.1:${port}`);
    });
  })
  .catch((ex) => {
    // eslint-disable-next-line no-console
    console.error(ex.stack);
    process.exit(1);
  });
