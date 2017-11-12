'use strict'
const socket = require('socket.io-client')('http://localhost:5000')
const diff = `diff --git a/foo b/foo
new file mode 100644
index 0000000..ce01362
--- /dev/null
+++ b/foo
@@ -0,0 +1 @@
+hello

`
socket.on('connect', () => {
    console.log('emitting change')
    socket.emit('commit', {
        author: 'nobody',
        diff
    })
})
