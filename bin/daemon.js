'use strict'
const sync = require('../src/sync')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const readFile = util.promisify(require('fs').readFile)

const url    = process.env['URL'] || 'https://nodeist-colony.herokuapp.com/'
const gitUrl = process.env['GIT_URL'] || 'localhost'
const REPO_DIR = `/tmp/nodeist-${Date.now()}`

const ROOM = process.env['ROOM'] || `room-${Date.now()}`

const socket = require('socket.io-client')(url)

let startWatcher, stopWatcher
// added a comment
console.log(`attempting to connect to ${url}`)
socket.on('connect', () => {
    console.log(`Joining room ${ROOM}...`)
    socket.emit('room', ROOM)
    socket.on('joined', () => {
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
                console.log('I am not the master')
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
            await exec(`rsync --delete -r --exclude=.git,node_modules ${REPO_DIR}/ ${process.cwd()}/`)
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
