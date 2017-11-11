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

    require(['vs/editor/editor.main'], () => {
        fetch("/index.html")
            .then(res => res.text())
            .then(body => {
                Editor.editor = monaco.editor.create(document.getElementById('container'), {
                    value: body,
                    language: 'javascript'
                })
            })
    })

    return Editor
})()
