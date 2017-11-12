// socket-io
SIO = (() => {
    const url = location.origin
    const SIO = { socket: null }
    SIO.requestId = Date.now()
    
    const socket = io(url)
    SIO.socket = socket
    $(function () {
        SIO.socket.on('connect', function () {
            console.log('connected')
        })
        // SIO.socket.on('change', function(msg){
        //     console.log('sio-msg', msg)
        // })
    })

    SIO.joinRoom = function () {
        document.getElementById('intro').style.display='none'
        document.getElementById('content').style.display='block'
        Editor.init()
        const room = document.getElementById('room').value
        socket.emit('room', { room })
        socket.on('joined', async () => {
            document.getElementById('room-chooser').style.display='none'
            document.getElementById('room-message').innerHTML = `Congratulations, you've joined room ${room}.`
            document.getElementById('file-chooser').style.display='block'
            console.log('Joined')
        })
    }

    SIO.retrieveFile = function () {
        SIO.requestId = Date.now()
        const fileName = document.getElementById('file').value
        console.log(`Retrieving ${fileName}`)
        Editor.resetFile(fileName)
        socket.emit('retrieve_file', {
            name: fileName, requestId: SIO.requestId
        })
    }

    SIO.sendFile = function () {
        const file = Editor.getFile()
        console.log(`Sending file ${JSON.stringify(file)}`)
        if (!file.name || !file.content) {
            console.log('error on file send')
            return
        }
        socket.emit('file_changed', file)
    }

    return SIO
})()
