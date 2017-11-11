'use strict'
const sync = require('../src/sync')

const url = process.env['URL'] || 'http://localhost:5000'
const socket = require('socket.io-client')(url)

console.log(`attempting to connect to ${url}`)
socket.on('connect', () => {
    console.log('connected')
    sync.watch(process.cwd())
})

socket.on('update', data => {
    sync.apply(socket.id, data)
    if (data.authorId === socket.id) {
        console.log(`${socket.id} Ignorning own updates of ${JSON.stringify(data)}`)
    } else {
        console.log(`${socket.id} Received updates of ${JSON.stringify(data)}`)
    }
})
