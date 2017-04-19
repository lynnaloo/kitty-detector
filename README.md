# kitty-detector

> Detects kitty motion and sends data to AWS IoT and Lambda.
> This project supports Tessel 2 (basic functionality) and Raspberry Pi.

## Parts List

*   [Tessel 2](http://www.tessel.io) or [Raspberry Pi](raspberrypi.org)
*   [PIR Sensor](https://www.adafruit.com/product/189)
*   External Battery Holder and 4 X AA Batteries (Tessel 2) or USB Power Supply (RPi)
*   Lead Wires

### Optional Parts

*   1 USB Camera or Raspberry Pi Camera
*   3-D Printed Kitty Detector case (optional)
*   1 Kitty (optional)

## Install

*   In your Amazon IoT console, add each of your devices as a "thing" resource and download
the provided certificates and private key.

*   Rename the files to ensure that you have `private.pem.key`,`certificate.pem.crt`, and `root-CA.pem.crt`
in the root of your device directory.

*   Setup your device per the device instructions and connect to the local network.

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
$ sudo node aws/raspberry-pi/raspberry-pi.js
```

## See Also

*   [IoT and Tessel Tutorial](https://cloudonaut.io/getting-started-with-aws-iot-and-tessel/)
*   [johnny-five](http://www.johnny-five.io)
*   [Tessel](http://www.tessel.io)
*   [Raspberry Pi](http://www.raspberrypi.org)
*   [Amazon IoT](https://console.aws.amazon.com/iot/)

## License

MIT
