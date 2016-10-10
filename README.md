# kitty-detector

> Detects kitty motion and sends data to AWS IoT.

## Parts List

*   [Tessel 2](http://www.tessel.io)
*   [PIR Sensor](https://www.adafruit.com/product/189)
*   External Battery Holder and 4 X AA Batteries
*   Lead Wires
*   3-D Printed Kitty Detector case (optional)
*   1 Kitty (optional)

## Install

*   In your Amazon IoT console, add your Tessel 2 as a "thing" resource and download
the provided certificates and private key.

*   Rename the files to ensure that you have `private.pem.key`,`certificate.pem.crt`, and `root-CA.pem.crt`
in the root of your project directory.

*   Setup your Tessel 2 per the device instructions and connect to the local network.

With [Node.js](https://node.org/) installed, run

```
$ npm i
$ t2 run index.js
```

## See Also

*   [IoT and Tessel Tutorial](https://cloudonaut.io/getting-started-with-aws-iot-and-tessel/)
*   [johnny-five](http://www.johnny-five.io)
*   [Tessel](http://www.tessel.io)
*   [Amazon IoT](https://console.aws.amazon.com/iot/)

## License

MIT
