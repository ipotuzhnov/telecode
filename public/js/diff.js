// diff parser

GitDiff = (() => {

    function date_diff_indays (dt1, dt2) {
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    }

    // const Notifications = initNotifcations();
    const DiffTitleDiv = document.getElementById('diff-title');
    const DiffDiv = document.getElementById('diff-content');
    const now = new Date();

    class GitDiff {
        static getJSONFromDiff (gitDiff) {
            console.log('jsonifying diff')
            return Diff2Html.getJsonFromDiff(gitDiff)
        }
        static getPrettyHtmlFromDiff (gitDiff) {
            const output =  Diff2Html.getPrettyHtmlFromDiff(gitDiff);
            const date = new Date();
            const daysDiff = date_diff_indays(now, date) 
            const when = daysDiff === 0 ? `today at ${
                [date.getHours(), date.getMinutes(), date.getSeconds()].join(":")}` : `${daysDiff} days ago`;
            DiffTitleDiv.innerHTML = `Your fellow developer pushed a change ${when}`;
            DiffDiv.innerHTML = output;                
            document.getElementById("diff").style.display="block";
            Notifications.pushTestNotification('Your fellow developer has pushed a change. Applying the change!')
            return output;
        }
        static async loadDiffFromURL (url) {
            const body = await fetch(url)
            const text = await body.text()
            return GitDiff.getJSONFromDiff(text)
        }
    }

    return GitDiff
})()
