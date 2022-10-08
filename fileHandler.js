import fs from "fs";
import e from "express";

export function readFile(phase, cb) {
    fs.readFile(`./phase${phase}.json`, "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        cb(jsonString)
    });
}

export function addPosition(newPosition, phase, cb) {
    readFile(phase, (jsonString) => {
        const positions = JSON.parse(jsonString)
        const maxId = Math.max(...(positions.map((pos) => parseInt(pos.id))))
        positions.push({...newPosition, id: maxId + 1})
        fs.writeFile(`./phase${phase}.json`, JSON.stringify(positions), err => {
            if(err) {
                cb(err)
            } else {
                cb({ok: 1})
            }
        })
    })
}

function swap(arr, indexA, indexB) {
    const tmp = arr[indexA]
    arr[indexA] = arr[indexB]
    arr[indexB] = tmp
    return arr
}

export function moveUp(phase, id, cb) {
    readFile(phase, (jsonString) => {
        const positions = JSON.parse(jsonString)
        const index = positions.findIndex((pos) => {
            return parseInt(pos.id) === parseInt(id)
        })
        if(index > 0) {
            const newPositions = swap(positions, index, index - 1)
            fs.writeFile(`./phase${phase}.json`, JSON.stringify(newPositions), err => {
                if(err) {
                    cb(err)
                } else {
                    cb({ok: 1})
                }
            })
        } else {
            cb({ok: 2})
        }
    })
}

export function moveDown(phase, id, cb) {
    readFile(phase, (jsonString) => {
        const positions = JSON.parse(jsonString)
        const index = positions.findIndex((pos) => {
            return parseInt(pos.id) === parseInt(id)
        })
        if(index + 1 !== positions.length) {
            const newPositions = swap(positions, index, index + 1)
            fs.writeFile(`./phase${phase}.json`, JSON.stringify(newPositions), err => {
                if(err) {
                    cb(err)
                } else {
                    cb({ok: 1})
                }
            })
        } else {
            cb({ok: 2})
        }
    })
}

export function getPosition(phase, id, cb){
    readFile(phase, (jsonString) => {
        const positions = JSON.parse(jsonString)
        const position = positions.filter((pos) => parseInt(pos.id) === parseInt(id))[0]
        cb(position)
    })
}

export function editPosition(newPosition, phase, cb) {
    readFile(phase, (jsonString) => {
        const positions = JSON.parse(jsonString)
        const newPositions = positions.map((pos) => {
            if(parseInt(pos.id) === parseInt(newPosition.id)) {
                return newPosition
            }
            return pos
        })
        fs.writeFile(`./phase${phase}.json`, JSON.stringify(newPositions), err => {
            if(err) {
                cb(err)
            } else {
                cb({ok: 1})
            }
        })
    })
}