import "firebase/messaging";
import firebase from 'firebase'

const firebaseCloudMessaging = {
  init: async function () {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCbChpKZaX7oBFs2HFaCtHxtbauJqvl3OE",
        authDomain: "ucode-51d41.firebaseapp.com",
        projectId: "ucode-51d41",
        storageBucket: "ucode-51d41.appspot.com",
        messagingSenderId: "429101898638",
        appId: "1:429101898638:web:5f196846d0290dc6fba2df",
        measurementId: "G-L6SYC6XJVV",
      });

      try {
        const messaging = firebase.messaging();

        const status = await Notification.requestPermission();

        if (status && status === "granted") {
          // if (true) {
          try {
            const fcm_token = await messaging.getToken({
              vapidKey:
                "BDaRdVA0HTBQihO_x1TIZwdfe_W-kD_qSh-ZhBm4dUlhpNpIavBl8a_FRdySAagcPe5chz4FzLYJClA9XihGsMc",
            });
            await navigator.serviceWorker.register("firebase-messaging-sw.js", {
              scope: "firebase-cloud-messaging-push-scope",
            });
            subscribeTokenToTopic(
              fcm_token,
              "1ecca1e7-5c34-4055-b685-df59e5021cbf"
            );

            console.log("fcm_token", fcm_token);
            return fcm_token;
          } catch (error) {
            console.log("error in try catch", error);
          }
        }
        return null;
      } catch (error) {
        return null;
      }
    }
  },
};

export { firebaseCloudMessaging };

function subscribeTokenToTopic(token, topic) {
  fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
    method: "POST",
    headers: new Headers({
      Authorization:
        "key=AAAAY-h3W44:APA91bGOb7Z4eHfVF3GhM6d-XYNLs_uQWhoNdv_NUklYunwo0K9cHUIQiI2Q0ZJqxJeuOi7IroHfsMVG5pEi5gtywesK3XGFSIXsJlPKgBvzg6tg2YVyy5AUdjSjRZ7Yy79NiQY2QKPa",
    }),
  })
    .then((response) => {
      if (response.status < 200 || response.status >= 400) {
        console.log(response.status, response.body);
      }
      console.log(`"${topic}" is subscribed`);
      return response.body;
    })
    .then((res) => console.log(res))
    .catch((error) => {
      console.error(error.body);
    });
  return true;
}
