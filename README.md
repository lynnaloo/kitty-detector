# kitty-detector

> Detects kitty motion and sends data to AWS IoT and Lambda.
> This project is best used with Raspberry Pi, but there is basic Tessel 2 support for detection.

## Parts List

*   [Raspberry Pi](raspberrypi.org) or [Tessel 2](http://www.tessel.io)
*   [PIR Sensor](https://www.adafruit.com/product/189)
*   External Battery Holder and 4 X AA Batteries (Tessel 2) or USB Power Supply (RPi)
*   Lead Wires

### Optional Parts

*   1 Raspberry Pi Camera
*   Kitty Detector case
*   1 Kitty

## Install

### For Amazon IoT

*   In your Amazon IoT console, add each of your devices as a "thing" resource and download
the provided certificates and private key.

*   Rename the files to ensure that you have `private.pem.key`,`certificate.pem.crt`, and `root-CA.pem.crt`
in the root of your device directory.

*   Setup your device per the device instructions and connect to the local network.

### For Amazon SDK (S3, etc)

*   [Create](http://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html) AWS Access Keys
*   [Set AWS Credentials files or Environment variables](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-environment) for access keys

### Tessel 2

With [Node.js](https://node.org/) installed, download the code and deploy to the device:

```
$ git clone https://github.com/lynnaloo/kitty-detector.git
$ cd kitty-detector
$ npm i
$ t2 push tessel/tessel.js
```

### Raspberry Pi Terminal

*   Update your Raspberry Pi and install `raspi-config`

```
$ apt-get update
$ apt-get upgrade
$ apt-get install raspi-config
```
*   Enable Raspberry Pi camera using configuration program

```
$ sudo raspi-config
```

*   With [Node.js](https://node.org/) installed, download the code and run on the device:

```
$ git clone https://github.com/lynnaloo/kitty-detector.git
$ cd kitty-detector
$ npm i -g yarn
$ yarn install
$ sudo npm run pi
```

## See Also

*   [IoT and Tessel Tutorial](https://cloudonaut.io/getting-started-with-aws-iot-and-tessel/)
*   [johnny-five](http://www.johnny-five.io)
*   [Tessel](http://www.tessel.io)
*   [Raspberry Pi](http://www.raspberrypi.org)
*   [Amazon IoT](https://console.aws.amazon.com/iot/)

## License

MIT
