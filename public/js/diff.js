// diff parser

GitDiff = (() => {

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

    function date_diff_indays (dt1, dt2) {
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    }

    $.getScript('/js/notification.js', function () { 
        const Notifications = initNotifcations();
        const DiffTitleDiv = document.getElementById('diff-title');
        const DiffDiv = document.getElementById('diff-content');
        const now = new Date();

        class GitDiff {
            static getJSONFromDiff (userName, gitDiff) {
                console.log(`getting dif ${gitDiff}`);
                
                const output =  Diff2Html.getJsonFromDiff(gitDiff);
                console.log(`output ${JSON.stringify(output)}`);
                return output;
            }
            static getPrettyHtmlFromDiff (userName, gitDiff) {
                console.log(`html getting dif ${gitDiff}`);
                
                const output =  Diff2Html.getPrettyHtmlFromDiff(gitDiff);
                console.log(`html output ${output}`);
                const date = new Date();
                const daysDiff = date_diff_indays(now, date) 
                const when = daysDiff === 0 ? `today at ${
                    [date.getHours(), date.getMinutes(), date.getSeconds()].join(":")}` : `${daysDiff} days ago`;
                DiffTitleDiv.innerHTML = `Latest edits from your fellow developers: ${userName} pushed a change ${when}`;
                DiffDiv.innerHTML = output;                
                document.getElementById("diff").style.display="block";
                Notifications.pushTestNotification(`${userName} has pushed a change. Applying the change!`);
                return output;
            }
            static async loadDiffFromURL (url) {
                const body = await fetch(url)
                const text = await body.text()
                return GitDiff.getJSONFromDiff(text)
            }
        }

        GitDiff.getJSONFromDiff("John", gitDiffFile1);
        GitDiff.getPrettyHtmlFromDiff("Tom", gitDiffFile1);
        //GitDiff.getJSONFromDiff(gitDiffFile2);
       // GitDiff.getPrettyHtmlFromDiff(gitDiffFile2);

        return GitDiff
    })
})()
