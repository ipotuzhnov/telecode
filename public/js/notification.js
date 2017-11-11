 
// notifications
Notifications = (() => {
    class Notifications {
        static init () {
            Notification.requestPermission().then((result) => {
                console.log(`Result on notifications permissions request ${result}`)
            })
        }

        static pushTestNotification () {
            Notifications.push(
                'Node knockout project says',
                'Whaaa, I\'m becoming well-adjusted, pay attention to me!',
                '../img/' + 'happy' + '_head.png'
            )
        }

        static push (title, body, icon) {
            const n = new Notification(title, { body, icon })
            console.log('displaying notification for 10 seconds')
            setTimeout(n.close.bind(n), 10000)
        }
    }

    return Notifications
})()
