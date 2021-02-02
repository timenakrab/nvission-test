const express = require('express');
const nextJS = require('next');
const fs = require('fs');
const useragent = require('express-useragent');
const bodyParser = require('body-parser');
const nvision = require('@nipacloud/nvision');

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

    server.post('/send-to-ml', (req, res) => {
      const { bs } = req.body.data;
      const objectDetectionService = nvision.objectDetection({
        apiKey:
          'cdb29f355cb4059995e054208c89cf3a667a9ced3a5e2a047d88c5d323a6e4fbf2c99ecfd01496e729446d925d16577aac',
        streamingKey:
          'cdb29f355cb4059995e054208a8acf3c372891ed3a0f2a097c88c5d778f6e4f8a9959fcfd64093ef7f106c950b455625ac',
      });
      objectDetectionService
        .predict({
          rawData: bs,
        })
        .then((result) => {
          console.log(result);
          res.json({ data: '' });
        })
        .catch((err) => {
          console.log(err.message);
          res.status(400).json({ err: err.message });
        });
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
