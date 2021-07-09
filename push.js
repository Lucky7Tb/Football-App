const webPush = require('web-push');
     
const vapidKeys = {
   "publicKey": "BCaiE2WQ-q7dacs1a1PPBMTtbEHi3ZyCVNbDO-jgQhMhx9FQ3xugvRYhWGPvq79vsRA1owFQuGw7nxgRDru1Ntk",
   "privateKey": "BOY1xbVFMvcE2S8qnuUtPlm0TMsoeSilFyvSR0ivaP4"
};
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

const pushSubscription = {
   "endpoint": "<Endpoint URL>",
   "keys": {
       "p256dh": "<p256dh Key>",
       "auth": "<Auth key>"
   }
};

const payload = "Hai ini adalah notifikasi PWA";
 
const options = {
   gcmAPIKey: '1083199324318',
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);