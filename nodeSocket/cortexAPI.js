const BrainFuck = require("nodeSocket/BrainFuckJS/libs/brainfuck");
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(80);

const EPOC = new BrainFuck('EPOCPLUS-6F0D69F2');

let client_id = 'vZBMOf14yce3Vxe5UXzzXpZexee86PDC1Iq5nSrC';
let client_secret = 'hLyAJyTACwukQTMlpU97NKWxwoK4jkfguFa9TBJbv9ybsaWV3NLpXaZKtlwpgxVACK6QYp5XrYDOPtPDxWeBcsWCTzltK329kHsWGhBS6WcSGJkUVlnHVKFyMmdTiANZ';

// 01. CONNECT
EPOC.Connect(client_id, client_secret);

// 02. INITIALIZE
EPOC.on('Ready', () => {
    console.log('READY!');
    EPOC.loadProfile('INSERT_YOUR_PROFILE_NAME');
    EPOC.startStream();
});

// 03. DATA STREAM
EPOC.on('Stream', (data) =>{

    // DO THINGS WITH COMMANDS AND FACE-ACTIONS...
    console.log(`command: ${ data.command } | eyeAction: ${ data.eyeAction } | upperFaceAction: ${ data.upperFaceAction } | lowerFaceAction: ${ data.lowerFaceAction } `)
    
    // Send to Socket
    io.emit('BRAINSTREAM', data);
})

io.on('connection', function(socket){
    console.log('a user connected');
});