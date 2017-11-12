'use strict'
const util      = require('util')
const exec      = util.promisify(require('child_process').exec)
const writeFile = util.promisify(require('fs').writeFile)
const readFile  = util.promisify(require('fs').readFile)

module.exports = function DB ({dir}) {
    return {
        version: null,
        incrementVersion () {
            this.version++
        },
        async readFile () {
            return await readFile('public/index.html', 'utf8')
        },
    }
}
