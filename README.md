# requirements
* requires the following system packages to be installed:
  * OSX
    * jp2a: `brew install jp2a`
    * qrencode: `brew install qrencode`
  * Ubuntu
    * `sudo apt-get install -y jp2a`
    * `sudo apt-get install -y qrencode`

# overview
* generate the ascii art
* upload two images.. get a MORPH between them. IN ASCII.
* use a way to ENCODE the two images using huffman encodeing / protobuffs so the resultant QRCODE is much simpler

# upload
* ~`pm2 start server.js --name ascii`~ now in config.json
* (from laptop) `rsync -azP path/to/sites/maladjusted root@68.183.119.128:/var/www/maladjusted`

# random musings
* all QR codes redirect to a URL ...?
* so how to encode ascii art ...?
* encode it in the query params?





* bit.ly?_=knneknlk.....


`qrencode -t ansiutf8 < ~/ascii.txt`




https://maladjusted.ca/





//// npm i -g image-to-ascii-cli
