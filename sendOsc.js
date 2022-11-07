import osc from 'osc'
import wss from "./webSocket.js";

const oscPort = new osc.UDPPort({
    remotePort: 8888,
    remoteAddress:"10.0.0.1",
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

oscPort.on("message", (oscMsg, timeTag, info) => {
    if(oscMsg.address === '/ack' && messageQueue.length > 1) {
        const oldMessage = messageQueue.shift()
        sendWsMessage(`Waiting in pose ${oldMessage.position} for ${oldMessage.timeToStay} seconds`)
        setTimeout(() => {
            const [newMessage] = messageQueue
            sendOsc(newMessage)
        }, oldMessage.timeToStay * 1000)
    } else {
        messageQueue.length = 0
        sendWsMessage("Idle")
    }
})

export function reset() {
    if(messageQueue > 0) {
        messageQueue.length = 0
    }
    sendOsc({
        leftHand: 0,
        rightHand: 0,
        leftLeg: 0,
        rightLeg: 0,
        timeToGet: 3,
        position: 0
    })

}

export function stopMessageQueue() {
    messageQueue.length = 0
    sendWsMessage("Stopped running phase")
    setTimeout(() => {
        sendWsMessage("Idle")
    }, 1000)
}

export default function sendMessages(messages) {
    if(messageQueue.length !== 0) {
        console.log(`Start phase ignored - tried to start another phase while a phase is running`)
        sendWsMessage('Start phase ignored - tried to start another phase while a phase is running')
        return
    }
    for(const message of messages) {
        messageQueue.push(message)
    }
    const [firstMessage] = messageQueue
    sendOsc(firstMessage)
}

function sendOsc(message) {
    const { leftHand, rightHand, leftLeg, rightLeg, timeToGet, position } = message
    console.log(`Moving to position ${position}`)
    sendWsMessage(`Moving to position ${position} in ${timeToGet} seconds`)
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

function sendWsMessage(message) {
    wss.clients.forEach((client) => {
        client.send(message)
    })
}