//this is const 
const { on } = require('events');
const express = require('express');
const path = require('path');
const { Socket } = require('socket.io');
const app = express();
const PORT = process.env.PORT || 4040
const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')));

let socketConnect = new Set()
io.on('connection',onConnect)

function onConnect(socket){
    console.log(socket.id);
    socketConnect.add(socket.id)

    io.emit('clinets-total' ,socketConnect.size)

    socket.on('disconnect',()=>{
        console.log('Socket disconnected' ,socket.id)
        socketConnect.delete(socket.id)
        io.emit('clinets-total' ,socketConnect.size)
    })

    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message',data)
    })

    socket.on('feedback' ,(data)=>{
        socket.broadcast.emit('feedback',data)
    })
}