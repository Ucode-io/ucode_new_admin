import { store } from "../../store";
export const websocketURL = `${import.meta.env.VITE_WEBSOCKET_URL}`;

let webSocket;
let chatSocket;

function connectSocket(sendMessage, chat_id, platformType, userId) {
  const authStore = store.getState().auth;
  const ws = new WebSocket(
    `${websocketURL}/ws/${chat_id}/${
      platformType === "websites" ? authStore.userId : userId
    }?sender_name=Admin`
  );

  // ws.addEventListener('open', function (event) {
  //   const message = {
  //     name: 'John',
  //     message: 'Hello, World!'
  //   };

  //   // Отправить сообщение в теле запроса
  //   ws.send(JSON.stringify(message));
  // });

  ws.onopen = function () {
    // notification.info({
    //   message: i18nRender('connected.to.websocket')
    // })
    // subscribe to some channels
    // ws.send("we have been connected to the web-socket :)");
    // ws.send("Hello, world!", {
    // });
    // ws.send(JSON.stringify(message));
  };

  ws.onclose = function (e) {
    console.log(`Socket is closed.`, e.reason);
    connectSocket();
  };

  ws.onerror = function (err) {
    console.error("Socket encountered error: ", err.message, "Closing socket");
    ws.close();
  };

  webSocket = ws;
}

function connectChatSocket() {
  const authStore = store.getState().auth;
  const environmentId = authStore.environmentId;
  const wsChat = new WebSocket(`${websocketURL}/ws/rooms/${environmentId}`);

  wsChat.onopen = function () {
    console.log("Get list connected");
  };

  wsChat.onclose = function (e) {
    console.log(`Get list socket is closed.`, e.reason);
    connectChatSocket();
  };

  wsChat.onerror = function (err) {
    console.error(
      "Get list socket encountered error: ",
      err.message,
      "Closing socket"
    );
    wsChat.close();
  };

  chatSocket = wsChat;
}

export { webSocket, chatSocket, connectSocket, connectChatSocket };
