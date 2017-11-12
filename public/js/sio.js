// socket-io
SIO = (() => {
    const url = 'https://nodeist-colony.herokuapp.com/'
    const SIO = { socket: null }
    SIO.requestId = Date.now();
    
    const socket = io(url);
    SIO.socket = socket;
    $(function () {
        SIO.socket.on("connect", function () {
            console.log('connected')
        })
        // SIO.socket.on('change', function(msg){
        //     console.log('sio-msg', msg)
        // })
    })

    SIO.joinRoom = function () {
        var ROOM = document.getElementById("room").value;
        socket.emit('room', ROOM)
        socket.on('joined', async () => {
            console.log("Joined");
        })
    }

    SIO.retrieveFile = function () {
        SIO.requestId = Date.now(); 
        var fileName = document.getElementById("file").value;
        console.log(`Retrieving ${fileName}`);
        Editor.resetFile(fileName)
        socket.emit('retrieve_file', {
            name: fileName, requestId: SIO.requestId
        })
    }

    return SIO
})()
