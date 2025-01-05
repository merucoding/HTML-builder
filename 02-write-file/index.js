const fs = require('node:fs');
const path = require('node:path');

const pathToFile = path.join(__dirname, 'text.txt');
const ws = fs.createWriteStream(pathToFile);

process.stdout.write('Hello, enter your text:\n\n');
process.stdin.setEncoding('utf-8');

process.stdin.on('data', (data) => {
  if (data.trim() === 'exit') {
    close();
  }
  // ws.write(data); // enter with line breaks
  ws.write(data.replace(/[\r\n]+/g, ''));
});

process.on('SIGINT', close);

function close() {
  ws.end();
  process.stdout.write('\nGood bye!\n');
  process.exit();
}
