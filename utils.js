const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = require('lz-string');
const { spawnSync, spawn } = require('child_process');
const pipe = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x);
const OUTPUT = 'qrcode.png';

// const zip = require('jszip');
// const { Readable } = require('stream');


// OPTION 1
// const util = require('util');
// const { exec } = require('child_process');
// const syncExec = util.promisify(exec);
// const { stdout, stderr } = await syncExec(`jp2a ./${TEMP} | awk '{print "http://maladjusted.ca?ascii="$1}' | qrencode -8 -o ./${OUTPUT}`);
// const qrcode = path.resolve(__dirname, OUTPUT);



/**
 * Generates an "ascii image" from an input image
 * @param {*} input JPEG image; todo...
 */
function asciify(input) {
  // asciify.stdout.pipe(wc.stdin);
  // const stream = Readable.from('asdf');

  // const { stdout, stderr } = await syncExec(`jp2a ${input}`);
  const { stdout, stderr } = spawnSync(`jp2a --width=80 ${input}`, {
    // input: input,
    shell: true,
    encoding : 'utf8' // for the spawnSync -- return data in utf8 (not a Buffer)
  });

  if (stdout) {
    return stdout;
  }
}

/**
 * Encodes a qrcode from a text input.
 * @param {string} input Text to generate a QRcode from
 * @returns {string} Input that was passed in.
 */
function qrencode(input) {
  spawnSync(`qrencode -8 -o ./${OUTPUT}`, {
    // stdio: 'inherit',
    input: input,
    shell: true
  });

  return input; // return `input` URL so we can surface in response.
}

/**
 * Makes a nice URL.
 * @param {string} input The input query param to URLify
 */
function urlify(input) {
  return `http://maladjusted.ca?ascii=${input}`;
}

/*
 * Compresses a string, then base64 encodes it. Works best if the input has a
 * reduced character set (ie. 16 chars used in an ascii image)
 * @note replaces '/' and '+' in the result so as to be URL-friendly (base64url)
 * @param {string} input
 */
function compress(input) {
  return compressToEncodedURIComponent(input);

  // const { stdout, stderr } = spawnSync(`gzip -9 | base64 | tr -d '=' | tr '/+' '_-'`, {
  //   shell: true,
  //   input: input,
  // })

  // return stdout;
}

function decompress(input) {
  return decompressFromEncodedURIComponent(input);
  // const { stdout, stderr } = spawnSync(`tr '_-' '/+' | base64 -d | gzip -d`, {
  //   shell: true,
  //   input: input, // + '==',    // the `==` is there for padding in the base64 string. not a huge deal, but it might throw warnings that the string is incomplete at times (ie. if not % 4 length)
  // })

  // return stdout;
}


/**
 * Converts to `base64` encoding
 * @param {any} input
 */
function base64(input) {
  const base64 = Buffer.from(input).toString('base64');
  return base64;
}

function unbase64ify(input) {
  const decoded = Buffer.from(input).toString('ascii');
  return decoded;
}


// https://github.com/mir3z/aalib.js

module.exports = {
  pipe,
  asciify,
  qrencode,
  urlify,
  compress,
  decompress,

  // base64ify,
  // unbase64ify
};
