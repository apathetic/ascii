//
// Returns the `ascii` query param as content, if it exists
// Otherwise, return index.html
//

// PACKAGES
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
// const { Readable } = require('stream');
const { pipe, asciify, qrencode, compress, decompress, urlify } = require('./utils.js');

// CONSTS
const TEMP = 'temp.jpg';
const QRCODE = 'qrcode.png';
const PORT = 4000;

// SETUP
const app = express();
const upload = multer({
  // storage: multer.memoryStorage(), // use a `stream`
  storage: multer.diskStorage({
    // save it to `TEMP`, every time, overwriting whatever image was last uploaded.
    destination: (req, file, cb) => cb(null, './'),
    filename: (req, file, cb) => cb(null, TEMP)
  }),
  limits: {
    files: 1, // allow only 1 file per request
    fileSize: 1024 * 1024, // 1 MB (max file size)
  },
  fileFilter: (req, file, cb) => cb(null, !!file.mimetype.match(/jpe?g/)),
});





app.get('/', (req, res) => {
  const { ascii } = req.query;

  if (ascii) {
    const view = path.resolve(__dirname, 'ascii.html');
    const qrcode = decompress(ascii);


    res.send(`<pre>${qrcode}</pre>`);
    // res.send(view.replace('%SERVER%', ascii));
  } else {
    const index = path.resolve(__dirname, 'index.html');
    res.sendFile(index);
  }
});


app.get('/encode', (req, res) => {
  const page = path.resolve(__dirname, 'encode.html');
  res.sendFile(page);
});


app.post('/encode', upload.single('image'), async function(req, res, next) {
  if (req.file) { // || req.files) {
    // const data = req.file.buffer;
    // const stream = Readable.from(data);
    // const readable = new Readable();
    // readable._read = () => {} // _read is required but you can noop it
    // readable.push(buffer)
    // readable.push(null)
    // readable.pipe(data) // consume the stream


    // console.log(req.file);

    // if (!req.file.mimetype.match(/jpe?g/) || req.file.size > 1000000) {
    //   res.send('oh you need to upload a jpeg smaller than 1MB for this dumb thing');
    //   return
    // }

    console.log('now ascii-code-ifying');

    const qrcode = pipe(asciify, compress, urlify, qrencode)(TEMP);


    res.send(`
      <code style="word-break:break-all;display:block;">${qrcode}</code>
      <img src="https://maladjusted.ca/${QRCODE}" />
    `);
    // res.send(qrcode);
    // who cares about clean up, TEMP, QRCODE
  } else {
    res.send('no file');
  }
});


app.get(`/${QRCODE}`, (req, res) => {
  const code = path.join(__dirname, QRCODE);
  res.sendFile(code);
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});
