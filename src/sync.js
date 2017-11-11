'use strict'
const watchr   = require('watchr')
const util     = require('util')
const path     = require('path')
const exec     = util.promisify(require('child_process').exec)
module.exports = {
    async onChange (dir, dbdir, changeType, absPath, newStat, oldStat) {
        try {
            const relPath = path.relative(dir, absPath)
            console.log(relPath + ' changed')
            console.log('running', `diff ${dir}/${relPath} ${dbdir}/${relPath}`)
            const diff = (await exec(`diff ${dir}/${relPath} ${dbdir}/${relPath} ; exit 0`)).stdout
            console.log('the diff:')
            console.log(diff)
        } catch (e) {
            console.error('there was an error', e)
        }
    },
    async watch (dir, dbdir) {
        await exec(`cp -r ${dir} ${dbdir}`)
        console.log(`Watching path ${dir}`)
        return await util.promisify(watchr.open)(dir, this.onChange.bind(this, dir, dbdir)).catch( err => {
            if (err) {
                console.err(`An error occurred watching ${dir}:`, err)
            }
        })
    }
}
