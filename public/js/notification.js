 
// push notification
PushNotification = (() => { 
     Notification.requestPermission().then(function(result) {
        console.log(`Result on notifications permissions request ${result}`);
    });
    spawnNotification('Whaaa, I\'m becoming well-adjusted, pay attention to me!', '../img/' + 'happy' + '_head.png', 'Node knockout project says');


    function spawnNotification(theBody, theIcon, theTitle) {
        var options = {
            body: theBody,
            icon: theIcon
        }
        var n = new Notification(theTitle, options);
        console.log('displaying notification');
        setTimeout(n.close.bind(n), 10000);
    }
})()