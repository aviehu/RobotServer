import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {readFile, addPosition, moveUp, moveDown, getPosition, editPosition} from "./fileHandler.js";
const app = express()
const port = 3001

app.use(cors())

app.use(bodyParser.json())

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})