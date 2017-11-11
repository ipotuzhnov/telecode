'use strict'
const watchr   = require('watchr')
const util     = require('util')
const path     = require('path')
const exec     = util.promisify(require('child_process').exec)
module.exports = {
    // Inits a git repo in the given directory
    async initRepo (repoDir, origin) {
        const cwd = repoDir
        await exec(`mkdir -p ${repoDir}`)
        return await exec(`git clone git://${origin}/master`, {cwd})
    },

    // Rsyncs a directory into the directory of a git repo, commits and pushes.
    async syncDirToRepo (dir, repoDir) {
        await exec(`rsync -r ${dir} ${repoDir}`)
        const cwd = repoDir
        await exec('git add .', {cwd})
        const diff = (exec('git diff', {cwd})).stdout
        await exec(`git commit -m ${Date.now()}`, {cwd})
        await exec('git push')
        return diff
    },

    async watch (dir, repoDir, origin, onChange) {
        await this.initRepo(repoDir, origin)
        return await util.promisify(watchr.open)(dir, async (changeType, absPath, newStat, oldStat) => {
            return await this.syncDirToRepo(dir, repoDir)
        })
    },

    async unwatch (dbdir) {
        return await exec(`rm -r ${dbdir}`)
    }
}
