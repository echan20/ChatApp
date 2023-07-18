var socket;
var usernameInput
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;

function onload() {
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("RoomID");
  dingSound = document.getElementById("Ding");
  connectButton = document.getElementById("ConnectButton");
  sendButton = document.getElementById("SendMessage");

  socket.on("join", function(room) {
    chatRoom.innerHTML = "Chatroom : " + room;
    connectButton.style.visibility = 'hidden';
    chatIDInput.readOnly = true;
    usernameInput.readOnly = true;
  })

  socket.on("recieve", function(message) {
    console.log(message);
    if (messages.length < 9) {
      messages.push(message);
    }
    else {
      messages.shift();
      messages.push(message);
    }
    dingSound.currentTime = 0;
    dingSound.play();
    for (i = 0; i < messages.length; i++) {
      document.getElementById("Message" + i).innerHTML = messages[i];
      document.getElementById("Message" + i).style.color = "#303030";
    }
  })

  messageInput.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      Send();
    }
  });
}

function Connect() {
  socket.emit("join", chatIDInput.value, usernameInput.value);
}

function delayReset() {
  delay = true;
  sendButton.style.visibility = 'visible';
}

function Send() {
  if (delay && messageInput.value.replace(/\s/g, "") != "") {
    delay = false;
    sendButton.style.visibility = 'hidden';
    setTimeout(delayReset, 1000);
    socket.emit("send", messageInput.value);
    messageInput.value = "";
  }
}
