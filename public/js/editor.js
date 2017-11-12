// editor
Editor = (() => {
    const INSERT = 'd2h-ins'
    const DELETE = 'd2h-del'

    class Editor {
        constructor (fileName) {
            this.fileName = fileName
            this.editor = null
            this.model = null
            this.socket = null
        }

        insertLine (number, text) {
            this.model.applyEdits([{ range: new monaco.Range(
                number, 1,
                number, 1
            ), text: text + '\n' }])
        }

        replaceLine (number, text) {
            this.model.applyEdits([{ range: new monaco.Range(
                number, 1,
                number + 1, 1
            ), text: text + '\n' }])
        }

        removeLine (number) {
            this.model.applyEdits([{ range: new monaco.Range(
                number, 1,
                number + 1, 1
            ), text: '' }])
        }

        applyDiff (diffs) {
            const diff = diffs.find(d => d.oldName === this.fileName)
            if (!diff) return
            
            const blocks = diff.blocks
            blocks.forEach(block => block.lines.forEach(line => {
                if (line.type === INSERT) {
                    console.log(`inserting line ${line.newNumber} line.content`)
                    return this.insertLine(line.newNumber, line.content.slice(1))
                }

                if (line.type === DELETE) {
                    console.log(`deleting line ${line.oldNumber}`)
                    return this.removeLine(line.oldNumber)
                }
            }))
        }
    }

    const editor = new Editor('public/index.html')

    $.getScript('/js/sio.js', function () { 
        const SIO = initSIO();
        editor.socket = SIO.socket

        require.config({ paths: { 'vs': '/node_modules/monaco-editor/min/vs' }})

        require(['vs/editor/editor.main'], async () => {
            editor.socket.emit("retrieve_file", {}, function (err, fileContent) {
                if (err) throw err
                // initialize monaco editor
                const m = monaco.editor.createModel(fileContent, 'html')
                const e = monaco.editor.create(
                    document.getElementById('container'),
                    { model: m }
                )

                // set up global editor
                editor.model = m
                editor.editor = e
            })
        })

        // highlight line
        // setTimeout(() => {
        //     if (!Editor.editor) return

        //     var newDecorations = []

        //     ranges.forEach(([ startLine, endLine ]) => {
        //         console.log('new changes!!!')
        //         var oldDecorations = editor.deltaDecorations(newDecorations, [{
        //             range: new monaco.Range(startLine,1,endLine,1),
        //             options: {
        //                 isWholeLine: true,
        //                 className: 'newChanges',
        //                 // glyphMarginClassName: 'myGlyphMarginClass'
        //             }
        //         }])
        //     })
        // }, 2000)
    })

    return editor
})()
