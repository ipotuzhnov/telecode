'use strict'
const watchr = require('watchr')
const util = require('util')
module.exports = {
    onChange (changeType, path, newStat, oldStat) {
        console.log(path + ' changed')
    },
    async watch (dir) {
        console.log(`Watching path ${dir}`)
        return await util.promisify(watchr.open)(dir, this.onChange.bind(this)).catch( err => {
            if (err) {
                console.err(`An error occurred watching ${dir}:`, err)
            }
        })
    }
}
