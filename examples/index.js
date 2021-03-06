const Service = require('../src/service');

const fs = require('fs');
const path = require('path');

let serviceConfiguration = {
    realm: 'slimerp',
    url: 'wss://localhost:8000',
    //user: 'example',
    //password: 'root',
    //useAuth: true,
};


if (process.env.USE_TLS) {

    const caPath = process.env.TLS_CA_CERT || path.join('certs', 'ca.crt');
    const certPath = process.env.TLS_CERT || path.join('certs', 'cert.crt');
    const keyPath = process.env.TLS_KEY || path.join('certs', 'cert.key');

    const ca = fs.readFileSync(caPath);
    const cert = fs.readFileSync(certPath);
    const key = fs.readFileSync(keyPath);

    serviceConfiguration.useTLS = true;
    serviceConfiguration.tlsConfiguration = {
        ca,
        cert,
        key
    }
}

const service = new Service(serviceConfiguration);

service.connect().then((session) => {
    service.registerAll([
        {
            name: 'com.service.test',
            handler: (args, kwagrs, details) => {

                // Do Magic

                return "Whiiiih."
            },
            options: {
                // Options from https://github.com/crossbario/autobahn-js/blob/master/doc/reference.md#subscribe
            }
        }
    ]);

    service.subscribeAll([
        {
            name: 'com.otherservice.test',
            handler: (args, kwagrs, details) => {

                // Do Magic

                return "Magicc..."
            },
            options: {
                // Options from https://github.com/crossbario/autobahn-js/blob/master/doc/reference.md#subscribe
            }
        }
    ]);


    session.call('com.service.test').then((result) => {
    //    console.log(result);
    })
}).catch((err) => {
    // Will be called on Connection Error.
    console.error(err);
});

