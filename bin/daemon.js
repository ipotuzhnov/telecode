#!/usr/bin/env node

'use strict'
const sync = require('../src/sync')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const readFile = util.promisify(require('fs').readFile)
const writeFile = util.promisify(require('fs').writeFile)
const haiku = new (require('haikunator'))

const argv = require('minimist')(process.argv.slice(2))
// parse cli args
if (argv.h || argv.help || argv.usage) {
    return console.log(`telecode usage
    -u | --url    SIO server address (default 'https://nodeist-colony.herokuapp.com/')
    -r | --room   The name of the room (default is a random Heroku like name)
    --reset=true  Reset commits on the server
`)
}
// -u | --url
let url
if (typeof argv.u === 'string' || typeof argv.url === 'string') {
    url = argv.u || argv.url
} else {
    // default
    url = process.env['URL'] || 'https://nodeist-colony.herokuapp.com/'
}
// -r | --room
let ROOM
if (typeof argv.r === 'string' || typeof argv.room === 'string') {
    ROOM = argv.r || argv.room
} else {
    // default
    ROOM = process.env['ROOM'] || haiku.haikunate()
}
const RESET = argv.reset === 'true' || process.env['RESET'] === 'true'


const REPO_DIR = `/tmp/nodeist-${Date.now()}`

const socket = require('socket.io-client')(url)

let startWatcher, stopWatcher
// added a comment
console.log(`attempting to connect to ${url}`)

socket.on('connect', () => {
    console.log(`Joining room ${ROOM}...`)
    socket.emit('room', { room: ROOM, gitter: true })
    socket.on('joined', async () => {
        function reset () {
            return new Promise((resolve) => {
                socket.emit('reset')
                console.log('resetting...')
                socket.on('reset', () => resolve())
            })
        }

        socket.on('reset', () => {
            console.log('The room was reset. Dying!!')
            process.exit(0)
        })

        if (RESET === true) {
            await reset()
        }

        socket.emit('replay')
        let isMaster = false
        socket.on('replay', async commits => {
            function sendCommit (diff) {
                const data = {author: socket.id, diff}
                console.log('emitting', data)
                socket.emit('commit', data)
            }
            if (commits.length === 0) {
                console.log('I am the master')
                isMaster = true
            } else {
                console.log('I am not the master', commits.length)
            }

            await sync.initRepo(REPO_DIR)

            if (isMaster) {
                const diff = await sync.syncDirToRepo(process.cwd(), REPO_DIR)
                sendCommit(diff)
            }

            for (const commit of commits) {
                console.log('applying change: ', commit)
                await applyChange(commit)
                console.log('done applying change')
            }

            {
                let watcherId
                startWatcher = async () => {
                    watcherId = Date.now()
                    console.log('starting watcher', watcherId)
                    await sync.watch(process.cwd(), REPO_DIR, watcherId, diff => { sendCommit(diff) })
                }
                stopWatcher = () => {
                    console.log('stopping watcher', watcherId)
                    sync.unwatch(process.cwd())
                }
            }
            startWatcher()
        })

        socket.on('retrieve_file', async ({ requestId, name }) => {
            const content = await readFile(`./${name}`, 'utf8')
            socket.emit('file_retrieved', { requestId, name, content })
        })

        socket.on('file_changed', async data => {
            console.log("file changed" + JSON.stringify(data));
            await writeFile(data.name, data.content);
        })
    })
})

async function applyChange (data) {
    console.log('got update', data)
    if (data.author !== socket.id) {
        try {
            stopWatcher && stopWatcher()
            await sync.apply(data.diff, REPO_DIR)
            await exec('git add .', {cwd : REPO_DIR})
            await exec(`git commit -m "${Date.now()}" --allow-empty`, {cwd: REPO_DIR})
            await exec(`rsync --delete -r --exclude=.git --exclude=node_modules ${REPO_DIR}/ ${process.cwd()}/`)
            startWatcher && await startWatcher()

        } catch (e) {
            console.error(e)
            process.exit(1)
        }
    } else {
        console.log(`${socket.id} Ignorning own updates of ${JSON.stringify(data)}`)
    }

}
socket.on('change', applyChange)
