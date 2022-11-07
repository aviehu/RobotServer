import http from 'http';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    ws.send('Hi there, I am a WebSocket server');
});

export default wss