'use strict'
const sync = require('../src/sync')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const url    = process.env['URL'] || 'http://localhost:5000'
const gitUrl = process.env['GIT_URL'] || 'localhost'
const REPO_DIR = `/tmp/nodeist-${Date.now()}`
console.log('repo dir', REPO_DIR)

const socket = require('socket.io-client')(url)

let locked
// added a comment
console.log(`attempting to connect to ${url}`)
socket.on('connect', () => {
    console.log('connected')
    sync.watch(process.cwd(), REPO_DIR, diff => {
        if (locked) return
        const data = {author: socket.id, diff}
        console.log('emitting', data)
        socket.emit('commit', data)
    })
})

socket.on('change', async data => {
    console.log('got update')
    if (data.author !== socket.id) {
        try {
            await sync.apply(data.diff)
            locked = true
            await exec(`rsync -r ${REPO_DIR} ${process.cwd()}`)
        } catch (e) {
            console.error(e)
            process.exit(1)
        } finally {
            locked = false
        }

    }
    console.log(`${socket.id} Ignorning own updates of ${JSON.stringify(data)}`)
})
