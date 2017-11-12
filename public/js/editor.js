// editor
Editor = (() => {
    const INSERT = 'd2h-ins'
    const DELETE = 'd2h-del'

    const Languages = {}

    class Editor {
        constructor (fileName) {
            this.fileName = fileName
            this.editor = null
            this.model = null
            this.files = {}
        }

        resetFile (fileName) {
            delete this.files[fileName]
        }

        setContent ({ name, content }) {
            this.fileName = name
            let ext = name.split('.').pop()
            ext = ext ? `.${ext}` : '.txt'
            const lang = Languages[ext]
            console.log(`loading file: ${name}, language: ${lang}`)

            const oldModel = this.model
            this.model = monaco.editor.createModel(content, lang)
            this.editor.setModel(this.model)
            document.getElementById("save").style.display="block";
            oldModel.dispose()
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
            console.log(`applyDiff ${this.fileName}`)
            console.log(diffs)
            const diff = diffs.find(d => d.oldName === this.fileName)
            console.log('found', diff)
            if (!diff) return
            
            const blocks = diff.blocks
            return blocks.forEach(block => this.applyDiffBlock(block))
        }

        applyDiffBlock (block) {
            const changes = block.lines.reduce((c, line) => {
                console.log('changes', c)
                if (line.type === DELETE) c[DELETE].push({
                    number: line.oldNumber,
                })
                if (line.type === INSERT) c[INSERT].push({
                    number: line.newNumber,
                    content: line.content.slice(1),
                })
                return c
            }, { [DELETE]: [], [INSERT]: [] })
            console.log('all changes', changes)
            changes[DELETE].reverse().map(line => this.removeLine(line.number))
            changes[INSERT].map(line => this.insertLine(line.number, line.content))
        }

        Languages () {
            return Languages
        }
        getFile () {
            return this.model ? {name: this.fileName, content: this.model.getValue()} : {};
        }
    }

    const fileName = 'foo'
    const editor = new Editor(fileName)

    require.config({ paths: { 'vs': '/node_modules/monaco-editor/min/vs' }})

    SIO.socket.on('file_retrieved', data => {
        console.log('file_retrieved', data)
        const requestId = SIO.requestId;
        const fileName = data.name

        if (editor.files[fileName]) return
        editor.files[fileName] = 'retrieved'

        if (data.requestId !== requestId) {
            console.log('not my foo')
        }

        editor.setContent(data)
    })

    SIO.socket.on('change', data => {
        console.log('got change', data)
        const diff = GitDiff.getJSONFromDiff(data.diff)
        editor.applyDiff(diff)
    })

    require(['vs/editor/editor.main'], () => {
        const languages = monaco.languages.getLanguages()
        languages.forEach(language => {
            language.extensions.forEach(ext => {
                Languages[ext] = language.id
            })
        })

        // initialize monaco editor
        const m = monaco.editor.createModel([
            'join a room',
            'and',
            'pick a file'
        ].join('\n'), 'txt')
        const e = monaco.editor.create(
            document.getElementById('container'),
            { model: m }
        )

        // set up global editor
        editor.model = m
        editor.editor = e
    })

    return editor
})()
