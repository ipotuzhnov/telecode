// editor
Editor = (() => {
    const Editor = { editor: null }

    require.config({ paths: { 'vs': '/node_modules/monaco-editor/min/vs' }})

    require(['vs/editor/editor.main'], async () => {
        const file = await fetch('/index.html')
        const content = await file.text()

        const model = monaco.editor.createModel(content, 'html')
        Editor.model = model

        const editor = monaco.editor.create(
            document.getElementById('container'),
            { model: Editor.model }
        )
        Editor.editor = editor


        // insert line
        function insertLine (number, text) {
            model.applyEdits([{ range: new monaco.Range(
                number, 1,
                number, 1
            ), text: text + '\n' }])
        }
        Editor.insertLine = insertLine

        // replace line
        function replaceLine (number, text) {
            model.applyEdits([{ range: new monaco.Range(
                number, 1,
                number + 1, 1
            ), text: text + '\n' }])
        }
        Editor.replaceLine = replaceLine

        // remove line
        function removeLine (number) {
            model.applyEdits([{ range: new monaco.Range(
                number, 1,
                number + 1, 1
            ), text: '' }])
        }
        Editor.removeLine = removeLine
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

    return Editor
})()
