// editor
Editor = (() => {
    class Editor {
        constructor (socket, editor, model) {
            this.editor = editor;
            this.model = model;
            this.socket = socket;
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
    }

    $.getScript('/js/sio.js', function () { 
        const SIO = initSIO();
        const editor = new Editor(SIO.socket);

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

        return editor
     })
})()
