const server = "http://127.0.0.1:3000";
const socket = io(server);

const messageInput = document.getElementById("messageInput");
const pseudoInput = document.getElementById("pseudoInput");
const messageList = document.getElementById("messageList");
const title = document.getElementById("title");
const memberList = document.getElementById("memberList");

let userid = "";
let pseudo = "";

// https://gist.github.com/gordonbrander/2230317
const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

if (localStorage.getItem("userid")) {
  userid = localStorage.getItem("userid");
} else {
  const id = ID();
  localStorage.setItem("userid", id);
  userid = id;
}

socket.emit("userid", userid);

socket.on("group", (result) => {
  result.forEach((element) => {
    console.log(`${element._id} : ${element.messages.length}`);

    let messageCount = document.getElementById(`${element._id}.messageCount`);

    if (messageCount) {
      messageCount.innerText = `(${element.messages.length})`;
    } else {
      memberList.innerHTML += `
      <li id="${element._id}">
        <span class="status online">
          <i class="fa fa-circle-o"></i>
        </span>
        <span>
          ${getUser} <span id="${element._id}.messageCount">(${element.messages.length})</span>
        </span>
      </li>
    `;
    }
  });
});

socket.on("notification", (data) => {
  console.log("Message depuis le seveur:", data);
});

socket.on("data", (messages) => {
  console.log("Liste des messages :", messages);

  let count = messages.length;

  messages.forEach((message) => {
    displayMessage(message, count);
  });
});

function submitMessage(e) {
  e.preventDefault();

  let message = messageInput.value;

  let timestamp = new Date();

  messageInput.value = "";

  socket.emit("send", message, timestamp, userid);
}

socket.on("send", (message, count) => {
  console.log("Nombre de messages envoyés:", count);

  console.log(message);

  displayMessage(message, count);
});

function displayMessage(message, count) {
  socket.emit("group");

  let timestamp = new Date(message.timestamp);
  timestamp = timestamp.getHours() + ":" + timestamp.getMinutes();

  let me = message.userid === userid ? "me" : "";

  title.innerHTML = `<b>Conversation title</b> (${count} messages)`;

  messageList.innerHTML += `	<li class=${me}>
    <div class="name">
      <span class="">${message.userid}</span>
    </div>
    <div class="message">
      <p>${message.text}</p>
      <span class="msg-time">${timestamp}</span>
    </div>`;
}

function updatePseudo() {
  pseudo = pseudoInput.value;
}

function getUser() {
  let user;

  if (pseudo != "") {
    user = pseudo;
  } else {
    user = userid;
  }
  return user;
}
