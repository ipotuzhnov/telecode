// diff parser

GitDiff = (() => {
    class GitDiff {
        static getJSONFromDiff (gitDiff) {
            return Diff2Html.getJsonFromDiff(gitDiff)
        }
    }

    GitDiff.gitDiff =
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

    return GitDiff
})()
