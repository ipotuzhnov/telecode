 
// notifications

Notifications = (() => {
    class Notifications {
        static init () {
            Notification.requestPermission().then((result) => {
                console.log(`Result on notifications permissions request ${result}`)
            })
        }

        static pushTestNotification (content) {
            Notifications.push(
                'Telecode says',
                content
            )
        }

        static push (title, body) {
            const n = new Notification(title, { body })
            n.onclick = function(event) {
                const diffDiv = document.getElementById("diff");
                document.getElementById("diff").style.display="block";
                window.location.href="#diff";
                setTimeout(n.close.bind(n), 100)
            }
            setTimeout(n.close.bind(n), 10000)
        }
    }

    return Notifications
})()
