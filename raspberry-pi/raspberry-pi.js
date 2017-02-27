const five = require('johnny-five');
const moment = require('moment-timezone');
const iot = require('aws-iot-device-sdk');
const Io = require('raspi-io');
const RaspiCam = require('raspicam');
const fs = require('fs');

const AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = '';
AWS.config.secretAccessKey = '';
AWS.config.region = 'us-east-1';
const s3 = new AWS.S3();

const now = moment().tz('America/New_York').format('LLL');
// Make the filename configurable
const camera = new RaspiCam({
  mode: 'photo',
  output: './tmp/cat.jpg',
  encoding: 'jpg',
	timeout: 0 // take the picture immediately
});
const board = new five.Board({
  io: new Io()
});

const device = iot.device({
  keyPath: __dirname + '/private.pem.key',
  certPath: __dirname + '/certificate.pem.crt',
  caPath: __dirname + '/root-CA.pem.crt',
  clientId: process.env.AWS_IOT_CLIENTID || 'raspberry-kitty',
  region: process.env.AWS_REGION || 'us-east-1'
});

board.on('ready', () => {
  const motion = new five.Motion({
    pin: 'P1-7', //PIR is wired to pin 7 (GPIO 4)
    freq: 100
  });

  if (camera) {
    camera.on('start', (err, timestamp) => {
      console.log('Camera is taking a photo');
    });

    camera.on('exit', (timestamp) => {
      console.log('Camera is now exiting');
    });

    // listen for the "read" event triggered when each new photo/video is saved
    camera.on('read', (err, timestamp, filename) => {
      camera.stop();

      console.log('Image saved with filename:', filename);
      const img = fs.readFile(`./tmp/${filename}`, (err, data) => {
        if (err) {
          console.log('Problem reading file', err);
          throw err;
        }

        const params = {
          Bucket: 'kitty-detections',
          Key: filename,
          Body: img,
          ContentType: 'image/jpeg',
          ACL: 'public-read'
        };

        s3.putObject(params, (err, data) => {
          if (err) {
            console.log('Problem uploading image', err);
            throw err;
          }

          // Successful
          console.log('Image successfully uploaded', data);
          const imageUrl = `https://s3.amazonaws.com/${params.Bucket}/${filename}`;
          console.log(imageUrl);
          const detectionObj = {
            'motion': true,
            'timestamp': now,
            'imageUrl': imageUrl,
            's3': {
              'bucket': params.Bucket,
              'image': filename
            }
          };
          device.publish('kitty-detection', JSON.stringify(detectionObj));
        });
      });
    });
  }

  // This happens once at the begnning of the session. The default state.
  motion.on('calibrated', () => {
    console.log('Motion detector calibrated');
  });

  motion.on('motionstart', data => {
    console.log(`Motion Alert: something was spotted at: ${now}`);
    if (camera) {
      // take a photo
      camera.start();
    } else {
      // if there isn't a camera, send the sns message
      device.publish('kitty-detection', JSON.stringify({'motion': true, 'timestamp': now}));
    }
  });

  motion.on('motionend', () => {
    console.log('No kitties detected in 100ms');
  });
});

device.on('connect', () => {
  console.log('Connecting to Amazon IoT');
});

device.on('message', (topic, payload) => {
  console.log('message', topic, payload.toString());
});

device.on('close', () => {
  // do nothing
});

device.on('reconnect', () => {
  console.log('Attempting to reconnect to Amazon IoT');
});

device.on('error', err => {
  console.log(`Error: ${err.code} while connecting to ${err.hostname}`);
});

device.on('offline', () => {
  // do nothing
});
