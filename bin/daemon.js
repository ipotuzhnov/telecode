
const url = "http://localhost:5000"

const socket = require('socket.io-client')(url)

socket.on('connect', () => {
    console.log("i received a connection")
    socket.emit('changes', "somedata")
});

