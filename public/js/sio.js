// socket-io
SIO = (() => {
    const url = 'https://nodeist-colony.herokuapp.com/'
    const SIO = { socket: null }

    SIO.socket = io(url)
    $(function () {
        SIO.socket.on("connect", function () {
            console.log('connected')
        })
        // SIO.socket.on('change', function(msg){
        //     console.log('sio-msg', msg)
        // })
    })

    SIO.joinRoom = function () {
        var room = document.getElementById("room")
    }

    return SIO
})()
