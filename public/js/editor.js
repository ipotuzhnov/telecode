// editor
Editor = (() => {
    class Editor {
        constructor (editor, model) {
            this.editor = editor
            this.model = model
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

    const editor = new Editor()

    require.config({ paths: { 'vs': '/node_modules/monaco-editor/min/vs' }})

    require(['vs/editor/editor.main'], async () => {
        const file = await fetch('/index.html')
        const content = await file.text()

        // initialize monaco editor
        const m = monaco.editor.createModel(content, 'html')
        const e = monaco.editor.create(
            document.getElementById('container'),
            { model: m }
        )

        // set up global editor
        editor.model = m
        editor.editor = e
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
})()
