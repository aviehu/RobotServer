import osc from 'osc'

const oscPort = new osc.UDPPort({
    remotePort: 8888,
    remoteAddress:"10.0.0.1",
    localAddress: "0.0.0.0",
});

oscPort.open();
oscPort.on("ready", function () {
    console.log("osc ready")
});

oscPort.on("error", function (error) {
    console.log("An error occurred: ", error.message);
});

export default function sendOsc(message) {
    const { leftHand, rightHand, leftLeg, rightLeg, timeToGet } = message
    oscPort.send({
        address: "/posture",
        args: [
            {
                type: "i",
                value: leftHand
            },
            {
                type: "i",
                value: rightHand
            },
            {
                type: "i",
                value: leftLeg
            },
            {
                type: "i",
                value: rightLeg
            },
            {
                type: "i",
                value: timeToGet
            }
        ]
    });
}