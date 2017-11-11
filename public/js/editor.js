// editor
Editor = (() => {
    const Editor = { editor: null }

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

    require.config({ paths: { 'vs': '/node_modules/monaco-editor/min/vs' }})

    require(['vs/editor/editor.main'], async () => {
        const file = await fetch("/index.html")
        const content = await file.text()

        Editor.model = monaco.editor.createModel(content, 'html')

        Editor.editor = monaco.editor.create(
            document.getElementById('container'),
            { model: Editor.model }
        )
    })

    return Editor
})()
