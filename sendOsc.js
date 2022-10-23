import osc from 'osc'

export default function sendOsc(phase) {
    const oscPort = new osc.UDPPort({
        remoteAddress: "10.0.0.3",
        remotePort: 8888
    });
    oscPort.open();
    oscPort.on("ready", function () {
        oscPort.send({
            address: "/posture",
            args: [
                {
                    type: "i",
                    value: -1
                },
                {
                    type: "i",
                    value: 2300
                },
                {
                    type: "i",
                    value: -1
                },
                {
                    type: "i",
                    value: -1
                }
            ]
        });
    });
    oscPort.on("error", function (error) {
        console.log("An error occurred: ", error.message);
    });
    console.log(oscPort)
    setTimeout(() => {
        oscPort.close()
    }, 100)
}