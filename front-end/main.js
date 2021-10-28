(function () {
    const server = 'http://127.0.0.1:3000'
    const socket = io(server);

    //socket part
    socket.on('notification', (data) => {
        console.log('Message depuis le seveur:', data);
    })

    //api calls
    fetch(`${server}/test`).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data);
    })
})()

function sendMessage() {
    socket.emit('messageToAll', { type : 'new_public_message', data : document.querySelector('#messageInput').value})
    // console.log(document.querySelector('#messageInput').value)
}
