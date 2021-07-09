window.addEventListener("DOMContentLoaded", () => {
    registerServiceWorker();
    requestNotificationPermission();
    registerPushManager();
});

function registerServiceWorker(){
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(() => {
                console.log("Berhasil menambahkan service worker");
            })
            .catch(() => {
                console.error("Gagal menambahkan service worker");
            });
    } else {
        utils.alert.error("Browser anda belum mendukung PWA");
    }
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then( result => {
          if (result === "denied") {
            utils.alert.error("Harap nyalakan fitur notifikasi");
            return;
          } else if (result === "default") {
            utils.alert.error("Harap nyalakan fitur notifikasi");
            return;
          }
        });
    }
}

function registerPushManager(){
    navigator.serviceWorker.ready.then(() => {
        if ('PushManager' in window){
            navigator.serviceWorker.getRegistration().then(registration => {
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: utils.urlBase64ToUint8Array("BCaiE2WQ-q7dacs1a1PPBMTtbEHi3ZyCVNbDO-jgQhMhx9FQ3xugvRYhWGPvq79vsRA1owFQuGw7nxgRDru1Ntk")
                }).then(function(subscribe) {
                    console.log(`EndPoint: ${subscribe.endpoint}`);
                    console.log(`p256dhKey: ${btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh'))))}`);
                    console.log(`AuthKey: ${btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth'))))}`);
                }).catch(function(e) {
                    console.error('Tidak dapat melakukan subscribe ', e.message);
                });
            });
        }
    });
}