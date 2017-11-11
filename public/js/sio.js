// socket-io
SIO = (() => {
    const SIO = { socket: null }

    $(function () {
        SIO.socket = io()
        SIO.socket.on('change', function(msg){
            console.log('sio-msg', msg)
        })
    })

    return SIO
})()
