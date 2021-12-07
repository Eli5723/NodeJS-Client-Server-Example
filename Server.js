const net = require('net');
const readline = require('readline');

const server = net.createServer();
server.listen(5000);


let sockets = {};
server.on("connection",(socket)=>{
    DisplayMessage("Incoming connection from: " + socket.remoteAddress);

    sockets[socket.remoteAddress] = socket;

    socket.on("data",(data)=>{
        DisplayMessage(`Client (${new Date().toLocaleString()}): ${data.toString()}`);
    });

    socket.on("error",()=>{
        delete sockets[socket.remoteAddress];
    });
    socket.on("end", ()=>{
        delete sockets[socket.remoteAddress];
    })
});

function DisplayMessage(message){
    let val = rl.line;
    rl.line = "";
    readline.cursorTo(process.stdout,0);
    console.log(message);
    rl.prompt();
    rl.write(val);
}

function sendMessage(message){
    message = message.trim();
    message = message.slice(0,1000);

    for (let s in sockets){
        let socket = sockets[s];

        socket.write(message);
        socket.pipe(socket);
    }
}

// Input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'MESSAGE> '
});

function AwaitInput(){
    rl.prompt();
}

rl.on("line", (answer)=>{
    rl.line = "";
    answer = answer.trim();
    answer = answer.slice(0,1000);
    sendMessage(answer);

    AwaitInput();
});