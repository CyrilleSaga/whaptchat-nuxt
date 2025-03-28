import {WebSocketServer} from 'ws'
import jwt from "jsonwebtoken";
import express from 'express';
import http from 'http';
import {prisma} from "../prisma.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server})

// Save logged-in users
const clients = new Map()

wss.on('connection', async (ws, request) => {

    // Get JWT token from query params
    const token = new URL(request.url, `http://${request.headers.host}`).searchParams.get('token');

    // Verify token
    let user
    try {
        user = jwt.verify(token, '4c2qoi75Bc1l3387Zh3BLNTA7bDQIl2OlVTuFj3yW59NOqadJXFDuTuZflc1bKLf');
    } catch (err) {
        ws.close()
        console.error("Error:" + err)
        return
    }

    // Save user
    clients.set(ws, user)

    // Envoi des messages précédents
    const messages = await prisma.message.findMany({
        select: {content: true, createdAt: true, user: {select: {username: true}}},
        orderBy: {createdAt: 'asc'}
    });

    messages.forEach(message => {
        ws.send(JSON.stringify({
            username: message.user.username,
            content: message.content,
            createdAt: message.createdAt
        }));
    })

    // Réception des messages
    ws.on('message', async (message) => {
        const parsedMessage = JSON.parse(message);

        // Sauvegarder le message en base
        const newMessage = await prisma.message.create({
            data: {userId: user.userId, content: parsedMessage.content}
        });

        // Diffuser le message à tous les clients connectés
        const dataToSend = JSON.stringify({
            username: user.username,
            content: parsedMessage.content,
            createdAt: newMessage.createdAt
        });

        clients.forEach((client, clientWs) => {
            if (clientWs.readyState === ws.OPEN) {
                clientWs.send(dataToSend);
            }
        });
    });

    // Déconnexion
    ws.on('close', () => {
        clients.delete(ws);
    });

})

server.listen(8080, () => {
    console.log("WebSocket server running on ws://localhost:8080");
})