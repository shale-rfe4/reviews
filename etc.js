const Stream = require('stream')
const fs = require('fs');
const moment = require('moment');
const readline = require('readline');
const transform = new Stream.Transform();

const rl = readline.createInterface({
  input: fs.createReadStream('./testdata.csv'),
  crlfDelay: Infinity
});

// const readData = fs.createReadStream('./testdata.csv');
transform._transform = function(chunk, encoding, callback) {
  console.log(chunk.toString().toUpperCase());
  callback();
}

rl.on('line', (line) => {
  line = line.split(',');
  line[3] = moment(line[3])
  console.log(`line from file: ${line.join(',')}`)
})


// readData.pipe(transform);