const net = require('net');
const readline = require('readline');

// Networking
const client = net.connect({port:5000, host: process.argc > 1 ? process.argv[1] : "127.0.0.1"},()=>{
    console.log("Connected!");
    AwaitInput();
});

client.on("data",(data)=>{
    let val = rl.line;
    rl.line = "";
    readline.cursorTo(process.stdout,0);
    console.log(`Server (${new Date().toLocaleString()}): ${data.toString()}`);
    rl.prompt();
    rl.write(val);
});

client.on("end",(data)=>{
    console.log("Disconnected from server.");
});

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
    client.write(answer);
    client.pipe(client);

    AwaitInput();
});