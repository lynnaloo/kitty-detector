const five = require('johnny-five');
const iot = require('aws-iot-device-sdk');
const Io = require('tessel-io');

const board = new five.Board({
  io: new Io()
});

const device = iot.device({
  keyPath: __dirname + '/private.pem.key',
  certPath: __dirname + '/certificate.pem.crt',
  caPath: __dirname + '/root-CA.pem.crt',
  clientId: process.env.AWS_IOT_CLIENTID || 'tessel2-friday',
  region: process.env.AWS_REGION || 'us-east-1'
});

board.on('ready', function () {
  const motion = new five.Motion({
    pin: 'B7'
  });

  // This happens once at the begnning of the session. The default state.
  motion.on('calibrated', function () {
    console.log('Motion detector calibrated');
  });

  // motion.on("data", function (data) {
  // });

  // motion.on('change', function () {
  // });

  motion.on('motionstart', function (data) {
    console.log(`Kitty Alert: Kitty spotted at: ${data.timestamp}`);
    device.publish('motion-detection', JSON.stringify({ 'motion': true, 'timestamp': data.timestamp}));
  });

  motion.on('motionend', function () {
    console.log('No kitties detected in 25ms');
  });
});

device.on('connect', function () {
  console.log('connect');
});

device.on('message', function (topic, payload) {
  console.log('message', topic, payload.toString());
});

device.on('close', function () {
  console.log('close');
});

device.on('reconnect', function () {
  console.log('reconnect');
});

device.on('error', function (err) {
  console.log(err);
})

device.on('offline', function () {
  console.log('offline');
});
