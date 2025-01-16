const fs = require('node:fs');
const path = require('node:path');

const pathToFile = path.join(__dirname, 'text.txt');
const rs = fs.createReadStream(pathToFile, 'utf-8');

rs.on('data', (chunk) => {
  console.log(chunk);
});

rs.on('error', (err) => {
  if (err.code === 'ENOENT') {
    console.log('Wrong path!');
  } else {
    console.log('Something wrong!', err);
  }
});

rs.on('end', () => {
  console.log('\nEnd!');
});
