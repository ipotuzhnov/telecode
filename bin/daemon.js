
const url = "http://localhost:5000"

const sockets = [1, 2, 3]

sockets.forEach(i => {
    const socket = require('socket.io-client')(url)

    socket.on('connect', () => {
        console.log(`${socket.id} received a connection`)
        socket.emit('commit', {"somevalue": "somekey"})
    })

    socket.on('update', data => {
        if (data.authorId === socket.id) {
            console.log(`${socket.id} Ignorning own updates of ${JSON.stringify(data)}`)
        } else {
            console.log(`${socket.id} Received updates of ${JSON.stringify(data)}`)
        }
    })
})
