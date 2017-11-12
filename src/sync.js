'use strict'
const util     = require('util')
const exec     = util.promisify(require('child_process').exec)
const writeFile = util.promisify(require('fs').writeFile)
const watch = util.promisify(require('watch').watchTree)
module.exports = {
    async apply (diff, cwd) {
        if (!diff) {
            return
        }
        const tmp = '/tmp/blah' + process.pid
        await writeFile(tmp, diff)
        return await exec(`git apply ${tmp}`, {cwd})
    },

    // Inits a git repo in the given directory
    async initRepo (repoDir) {
        console.log(`initting git repo in ${repoDir}`)
        const cwd = repoDir
        await exec(`mkdir -p ${repoDir}`)
        return await exec('git init', {cwd})
    },

    // Rsyncs a directory into the directory of a git repo, commits and pushes.
    async syncDirToRepo (dir, repoDir) {
        await exec(`rsync -r --delete --exclude=.git --exclude=node_modules ${dir}/ ${repoDir}/`)
        const cwd = repoDir
        await exec('git add .', {cwd})
        const result = await exec('git diff --staged', {cwd})
        console.log('result', result)
        const diff = result.stdout
        console.log('diff', diff)
        await exec(`git commit --allow-empty -m ${Date.now()}`, {cwd})
        console.log('diff', diff)
        return diff
    },

    async watch (dir, repoDir, watcherId, sendCommit) {
        let lock = false
        return await watch(dir, {ignoreDotFiles: true}, async (f, prev, curr) => {
            if (typeof f === 'object' && prev === null && curr === null) {
                return
            }
            if (lock) return
            console.log('Received from watcher', watcherId)
            lock = true
            const diff = await this.syncDirToRepo(dir, repoDir)
            sendCommit(diff)
            lock = false
        })
    },

    unwatch (dir) {
        return require('watch').unwatchTree(dir)
    }
}
