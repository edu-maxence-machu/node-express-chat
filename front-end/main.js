(function () {
    const server = 'http://127.0.0.1:3000'
    const socket = io(server);
    
    socket.on('notification', (data) => {
        console.log('Message depuis le seveur:', data);
    })

    fetch(`${server}/test`).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data);
    })

    let chat = document.getElementById('chat');

    console.log(document.forms.message)

    document.forms.message.addEventListener('submit', function(e){
        console.log('submit');
        e.preventDefault();
        let inputMessage = document.forms.message.inputMessage.value;

        socket.emit('chat', {
            data: inputMessage
        })
    })

    socket.on('notification', function(notif) {
        console.log(notif);
    })

    socket.on('chat', function(message) {
        console.log(message);

        let msg = document.createElement('li');
        msg.innerText = message;
        chat.appendChild(msg);
    })

})()