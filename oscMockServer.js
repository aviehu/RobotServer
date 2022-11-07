import osc from 'osc'

const udpPort = new osc.UDPPort({
    localPort: 8888,
    remotePort: 4444,
    remoteAddress: "127.0.0.1",
    metadata: true
});

udpPort.on("message", function (oscMsg, timeTag, info) {
    console.log("An OSC message just arrived!", oscMsg);
    console.log("Remote info is: ", info);
    const timeout = oscMsg.args[4].value
    setTimeout(() => {
        udpPort.send({
            address: "/ack",
            args: []
        })
    }, timeout)
});

udpPort.open();
