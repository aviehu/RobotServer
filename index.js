import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {
    readFile,
    addPosition,
    moveUp,
    moveDown,
    getPosition,
    editPosition,
    deletePosition
} from "./fileHandler.js";
import runPhase from "./runPhase.js";
import { stopMessageQueue, reset } from './sendOsc.js'

const app = express()
const port = 3001

app.use(cors())

app.use(bodyParser.json())

app.get('/startphase/:phase', (req, res) => {
    const { phase } = req.params
    runPhase(phase)
    res.send({ok: 1})
})

app.get('/reset', (req, res) => {
    reset()
    res.send({ok: 1})
})

app.get('/stop', (req,res) => {
    stopMessageQueue()
    res.send({ok: 1})
})

app.get('/:phase', (req, res) => {
    const { phase } = req.params
    readFile(phase, (data) => res.send(data))
})

app.get('/:phase/:id', (req, res) => {
    const { phase, id } = req.params
    getPosition(phase, id, (ans) => {
        res.send(ans)
    })
})

app.post('/addposition/:phase', (req, res) => {
    const { phase } = req.params
    const { body } = req
    addPosition(body, phase, (ans) => {
        res.send(ans)
    })

})

app.post('/editposition/:phase', (req, res) => {
    const { phase } = req.params
    const { body } = req
    editPosition(body, phase, (ans) => {
        res.send(ans)
    })
})

app.get('/moveup/:phase/:id', (req, res) => {
    const { phase, id } = req.params
    moveUp(phase, id, (ans) => {
        res.send(ans)
    })
})

app.get('/moveDown/:phase/:id', (req, res) => {
    const { phase, id } = req.params
    moveDown(phase,id, (ans) => {
        res.send(ans)
    })
})

app.delete('/:phase/:id', (req, res) => {
    const { phase, id } = req.params
    deletePosition(phase, id, (ans) => {
        res.send(ans)
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

