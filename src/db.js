'use strict'
const util      = require('util')
const exec      = util.promisify(require('child_process').exec)
const writeFile = util.promisify(require('fs').writeFile)
const readFile  = util.promisify(require('fs').readFile)

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
            await exec(`mkdir -p ${dir}/master`)
            const cwd = `${dir}/master`
            console.log(`initting git repo in ${cwd}`)
            return await exec('git init', {cwd})
        },
        async initGitServer () {
            const gitDaemon = require('child_process').spawn('git', [ 'daemon', '--base-path=.', '--export-all', '--timeout=5'], {cwd: `${dir}`})
            gitDaemon.stdout.pipe(process.stdout)
            gitDaemon.stderr.pipe(process.stderr)
        },
        async readFile () {
            return await readFile('public/index.html', 'utf8')
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
