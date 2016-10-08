# kitty-detector

> Detects kitty motion and sends data to AWS IoT. Uses a Tessel 2 and an Adafruit PIR sensor to detect movement

## Install

Ensure that you have `private.pem.key`,`certificate.pem.crt`, and `root-CA.pem.crt` files
in the root of your directory from AWS IoT.

With [Node.js](https://node.org/) installed, run

```
$ npm i
$ t2 run index.js
```

## See Also

## License

MIT
