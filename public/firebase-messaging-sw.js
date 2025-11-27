importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCbChpKZaX7oBFs2HFaCtHxtbauJqvl3OE",
  authDomain: "ucode-51d41.firebaseapp.com",
  projectId: "ucode-51d41",
  storageBucket: "ucode-51d41.appspot.com",
  messagingSenderId: "429101898638",
  appId: "1:429101898638:web:5f196846d0290dc6fba2df",
  measurementId: "G-L6SYC6XJVV",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload?.notification?.title || payload?.data?.title;
  const notificationOptions = {
    body: payload?.notification?.body || payload?.data?.body,
    title: payload?.notification?.title || payload?.data?.title,
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
