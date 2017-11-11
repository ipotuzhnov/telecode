// socket-io
function initSIO () {
    console.log("in init")
    const url = 'http://localhost:5000'
    const SIO = { socket: null }

    SIO.socket = io(url)
    SIO.socket.on("connect", function () {
        console.log('connected')
    })
    SIO.socket.on('change', function(msg){
        console.log('sio-msg', msg)
    })

    return SIO
}
