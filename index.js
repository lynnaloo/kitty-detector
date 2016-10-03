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

board.on('ready', () => {
  const motion = new five.Motion('B7');

  // This happens once at the begnning of the session. The default state.
  motion.on('calibrated', () => {
    console.log('Motion detector calibrated');
  });

  motion.on('motionstart', data => {
    console.log(`Kitty Alert: Kitty spotted at: ${data.timestamp}`);
    device.publish('motion-detection', JSON.stringify({ 'motion': true, 'timestamp': data.timestamp}));
  });

  motion.on('motionend', () => {
    console.log('No kitties detected in 25ms');
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
