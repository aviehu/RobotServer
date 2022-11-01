import {readFile} from "./fileHandler.js";
import positionToPercentage from './positionToPercentage.json' assert {type: 'json'};
import sendOsc from "./sendOsc.js";

export default function runPhase(phase) {
    readFile(phase, async (phaseFile) => {
        const phaseJson = JSON.parse(phaseFile)
        for(const movement of phaseJson ) {
            const { position } = movement
            const message = {
                ...positionToPercentage.filter((ptp) => ptp.position === parseInt(position))[0],
                ...movement
            }
            await runMovement(message)
        }
    })
}

function runMovement(message) {
    const { timeToGet, timeToStay } = message
    const waitingTime = parseInt(timeToGet) * 1000 + parseInt(timeToStay) * 1000
    return new Promise((resolve) => {
        //sendOsc(message)
        setTimeout(() => {
            resolve(null)
        }, waitingTime)
    })
}