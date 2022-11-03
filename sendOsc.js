import osc from 'osc'

const oscPort = new osc.UDPPort({
    remotePort: 8888,
    remoteAddress:"127.0.0.1",
    localPort: 4444
});

oscPort.open();
oscPort.on("ready", function () {
    console.log("osc ready")
});

oscPort.on("error", function (error) {
    console.log("An error occurred: ", error.message);
});

const messageQueue = []
const timeoutQueue = []

oscPort.on("message", (oscMsg, timeTag, info) => {
    console.log("Done")
    if(oscMsg.address === '/ack' && messageQueue.length > 0) {
        setTimeout(() => {
            sendOsc(messageQueue.shift())
        }, timeoutQueue.shift() * 1000)
    } else {
        messageQueue.length = 0
        timeoutQueue.length = 0
        console.log("Phase Done")
    }
})

export default function sendMessages(messages) {
    if(messageQueue.length !== 0) {
        console.log(`Start phase ignored - tried to start another phase while a phase is running`)
        return
    }
    for(const message of messages) {
        messageQueue.push(message)
        timeoutQueue.push(message.timeToStay)
    }
    const firstMessage = messageQueue.shift()
    sendOsc(firstMessage)
}

function sendOsc(message) {
    const { leftHand, rightHand, leftLeg, rightLeg, timeToGet, position } = message
    console.log(`Moving to position ${position}`)
    oscPort.send({
        address: "/posture",
        args: [
            {
                type: "i",
                value: Math.floor(leftHand * 10)
            },
            {
                type: "i",
                value: Math.floor(rightHand * 10)
            },
            {
                type: "i",
                value: Math.floor(leftLeg * 10)
            },
            {
                type: "i",
                value: Math.floor(rightLeg * 10)
            },
            {
                type: "i",
                value: parseInt(timeToGet) * 1000
            }
        ]
    });
}