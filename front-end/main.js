const server = 'http://127.0.0.1:3000'
const socket = io(server);

(function () {

    //socket part
    socket.on('notification', (data) => {
        console.log('Message depuis le seveur:', data);
    })

    socket.on('messageToAll', (data) => {
        console.log(`Nouveau message dans le chat public : ${data.data}`)
        displayMessage('Utilisateur', data.data, '?:?? pm')
    })

    //api calls
    fetch(`${server}/test`).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data);
    })
})()

//functions used in socket context
    //on submit button click, send it to the server
function sendMessage() {
    socket.emit('messageToAll', { type : 'new_public_message', data : document.querySelector('#messageInput').value})
}
    //once a message is sent by the server, add it to the DOM
function displayMessage(userName, msg, time) {
    document.querySelector('.chat-list ul').innerHTML += '' +
        '<li class="">' +
        '<div class="name">' +
        '   <span class="">'+userName+'</span>' +
        '</div>' +
        '<div class="message">' +
        '   <p>'+msg+'</p>' +
        '   <span class="msg-time">'+time+'</span>' +
        '</div>'
}
