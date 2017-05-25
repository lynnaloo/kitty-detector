const five = require('johnny-five');
const moment = require('moment-timezone');
const Io = require('raspi-io');
const RaspiCam = require('raspicam');
const fs = require('fs');
const path = require('path');

const Client = require('ibmiotf');
const config = {
  'org': 'cat-detector',
  'id': 'raspberry-kitty',
  'type': 'raspberry-pi',
  'domain': 'internetofthings.ibmcloud.com',
  'auth-method': 'token',
  'auth-token': process.env.IOT_AUTH_TOKEN
};
const device = new Client.IotfDevice(config);

// Raspberry Pi Camera configuration
const camera = new RaspiCam({
  mode: 'photo',
  output: './tmp/cat.jpg',
  encoding: 'jpg',
	timeout: 0 // take the picture immediately
});
const board = new five.Board({
  io: new Io()
});

board.on('ready', () => {
  // initialize motion sensor
  const motion = new five.Motion({
    pin: 'P1-7', //PIR is wired to pin 7 (GPIO 4)
    freq: 100
  });
  // This happens once at the begnning of the session. The default state.
  motion.on('calibrated', () => {
    console.log('Motion detector calibrated and ready');
  });

  // connect to IBM IoT
  device.connect();
  // setting the log level
  device.log.setLevel('info');
  // log errors
  device.on('error', err => {
    console.log(`Error: ${err.code} while connecting to ${err.hostname}`);
  });

  device.on('connect', () => {
    console.log('Connecting to IBM Iot');

    motion.on('motionstart', data => {
      const now = moment().tz('America/New_York').format('LLL');
      console.log(`Motion Alert: something was spotted at: ${now}`);
      if (camera) {
        // take a photo
        startCamera();
      } else {
        console.log('Oops. There is no camera connected.');
      }
    });

    motion.on('motionend', () => {
      console.log('Motion has stopped for 100ms');
    });
  });
});

function startCamera() {
  camera.start(); // take a picture
  camera.on('start', (err, timestamp) => {
    console.log('Camera is taking a photo!');
  });

  // listen for the "read" event triggered when each new photo/video is saved
  camera.on('read', (err, timestamp, filename) => {
    console.log('Image saved with filename:', filename);
    camera.stop();

    // read the file from the /tmp directory
    fs.readFile(`./tmp/${filename}`, (err, data) => {
      if (err) {
        console.log('Problem reading file', err);
        throw err;
      }

      const timestamp = moment().valueOf();
      const newFileName = `${path.parse(filename).name}-${timestamp}${path.parse(filename).ext}`;

      const params = {
        Key: newFileName,
        Body: data, // file buffer
        ContentType: 'image/jpeg'
      };

      uploadFile(params)
      .then((imageUrl) => {
        const detectionObj = {
          'motion': true,
          'timestamp': moment().tz('America/New_York').format('LLL'),
          'imageUrl': imageUrl
        };
        device.publish('kitty-detection', 'json', JSON.stringify(detectionObj));
      });
    });
  });
}

// TODO: move this to a separate library
function uploadFile(params) {
  return new Promise((resolve, reject) => {
    console.log('Image successfully uploaded');
    const imageUrl = `https://s3.amazonaws.com/${params.Bucket}/${params.Key}`;
    resolve(imageUrl);
  });
}
