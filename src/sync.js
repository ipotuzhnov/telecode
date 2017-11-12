'use strict'
const watchr   = require('watchr')
const util     = require('util')
const path     = require('path')
const exec     = util.promisify(require('child_process').exec)
const writeFile = util.promisify(require('fs').writeFile)
const watch = util.promisify(require('watchr').open)
module.exports = {
    async apply (diff, dir) {
        const tmp = '/tmp/blah'
        await writeFile(tmp, diff)
        return await exec('git apply /tmp/blah', {cwd: dir})
    },

    // Inits a git repo in the given directory
    async initRepo (repoDir) {
        const cwd = repoDir
        await exec(`mkdir -p ${repoDir}`)
        return await exec('git init', {cwd})
    },

    // Rsyncs a directory into the directory of a git repo, commits and pushes.
    async syncDirToRepo (dir, repoDir) {
        await exec(`rsync -r ${dir}/ ${repoDir}/`)
        const cwd = repoDir
        await exec('git add .', {cwd})
        const result = await exec('git diff --staged', {cwd})
        console.log('result', result)
        const diff = result.stdout
        console.log('diff', diff)
        await exec(`git commit -m ${Date.now()}`, {cwd})
        console.log('diff', diff)
        return diff
    },

    async watch (dir, repoDir, diffHandler) {
        await this.initRepo(repoDir)
        return await watch(dir, async (changeType, absPath, newStat, oldStat) => {
            const diff = await this.syncDirToRepo(dir, repoDir)
            diffHandler(diff)
        })
    },

    async unwatch (dbdir) {
        return await exec(`rm -r ${dbdir}`)
    }
}
