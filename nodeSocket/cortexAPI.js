const BrainFuck = require("../../libs/brainfuck");
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(80);

const EPOC = new BrainFuck('INSERT_YOUR_HEADSET_ID');

let client_id = 'INSERT_YOUR_CLIENT_ID';
let client_secret = 'INSERT_YOUR_CLIENT_SECRET';

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