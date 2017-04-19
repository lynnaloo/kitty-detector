const five = require('johnny-five');
const moment = require('moment-timezone');
const iot = require('aws-iot-device-sdk');
const Io = require('tessel-io');
const board = new five.Board({
  io: new Io()
});

const device = iot.device({
  keyPath: __dirname + '/keys/private.pem.key',
  certPath: __dirname + '/keys/certificate.pem.crt',
  caPath: __dirname + '/keys/root-CA.pem.crt',
  clientId: process.env.AWS_IOT_CLIENTID || 'tessel2-friday',
  region: process.env.AWS_REGION || 'us-east-1'
});

board.on('ready', () => {
  const motion = new five.Motion({
    pin: 'B7',
    freq: 100
  });

  // This happens once at the begnning of the session. The default state.
  motion.on('calibrated', () => {
    console.log('Motion detector calibrated');
  });

  motion.on('motionstart', data => {
    const now = moment().tz('America/New_York').format('LLL');
    console.log(`Kitty Alert: Kitty spotted at: ${now}`);
    device.publish('kitty-detection', { 'motion': true, 'timestamp': now});
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
