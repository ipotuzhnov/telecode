// diff parser

GitDiff = (() => {

    //const htmlString = Diff2Html.getPrettyHtml("somestring", {inputFormat: 'diff', showFiles: true, matching: 'lines'});
    //console.log(`htmlString ${htmlString}`)
    class GitDiff {
        static getJSONFromDiff (gitDiff) {
            
            console.log(`getting dif ${gitDiff}`);
            
            const output =  Diff2Html.getJsonFromDiff(gitDiff);
            console.log(`output ${JSON.stringify(output)}`);
            return output;
        }
    }

   const gitDiffFile1 = 
        `diff --git a/public/index.html b/public/index.html
        index ccd4b91..b725ef0 100644
        --- a/public/index.html
        +++ b/public/index.html
        @@ -6,11 +6,12 @@
        </head>
        <body>
        
        -<h2>Hello Ethel and Ilia! And Conner, someday.</h2>
        
        -<ul id="messages"></ul>
        +<h3>Hello Ethel and Ilia! And Conner, someday. Wow this file is looking so different.</h3>
        +<ul id="messages222"></ul>
        +<ul id="messages123"></ul>
        
        -<div id="container" style="width:800px;height:600px;border:1px solid grey"></div>
        +<div id="container"   style="width:800px;height:600px;border:1px solid grey"></div>
    `
    const gitDiffFile2 = 
    `diff --git a/package.json b/package.json
    index eb93f16..1238995 100644
    --- a/package.json
    +++ b/package.json
    @@ -16,7 +16,9 @@
        "nodemon": "^1.11.0"
    },
    "dependencies": {
    +    "diff2html": "^2.3.2",
        "express": "^4.16.2",
    +    "git-diff": "^2.0.4",
        "monaco-editor": "^0.10.1",
        "socket.io": "^2.0.4",
        "socket.io-client": "2.0.4",
    `

    GitDiff.getJSONFromDiff(gitDiffFile1);
    GitDiff.getJSONFromDiff(gitDiffFile2);

    return GitDiff
})()
