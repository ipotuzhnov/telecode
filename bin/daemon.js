
const url = "http://localhost:5000"

const socket = require('socket.io-client')(url)

socket.on('connect', function(){
    console.log("i received a connection")
    socket.emit("wow,something happened", function () {
        console.log("after emit")
    })
});

