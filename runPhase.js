import {readFile} from "./fileHandler.js";
import positionToPercentage from './positionToPercentage.json' assert {type: 'json'};
import sendMessages from "./sendOsc.js";


export default function runPhase(phase) {
    readFile(phase, async (phaseFile) => {
        const phaseJson = JSON.parse(phaseFile)
        const messageQueue = phaseJson.map((movement) => {
            const { position } = movement
            return {
                ...positionToPercentage.filter((ptp) => ptp.position === parseInt(position))[0],
                ...movement
            }
        })
        sendMessages(messageQueue)
    })
}

function runMovement(message) {
    const { timeToGet, timeToStay } = message
    const waitingTime = parseInt(timeToGet) * 1000 + parseInt(timeToStay) * 1000
    return new Promise((resolve) => {
        sendOsc(message)
        console.log(message)
        setTimeout(() => {
            resolve(null)
        }, waitingTime)
    })
}