'use strict'
const util      = require('util')
const exec      = util.promisify(require('child_process').exec)
const writeFile = util.promisify(require('fs').writeFile)

module.exports = function DB ({dir}) {
    async function dbExec (cmd) {
        return await exec(cmd, { cwd: dir})
    }
    return {
        version: null,
        incrementVersion () {
            this.version++
        },
        async init () {
            this.version = 0
            return await exec(`mkdir -p ${dir}`)
        },
        async update ({patch}) {
            const tmpFileName = `tmp.${Date.now()}`
            await writeFile(`${dir}/${tmpFileName}`, patch)
            const ret = await dbExec(`cat ${tmpFileName} | patch`)
            await dbExec(`rm ${tmpFileName}`)
            return ret
        }
    }
}