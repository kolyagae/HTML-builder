const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output} = require('process');
const rl = readline.createInterface({input, output});

const textFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));
console.log('Приветствую! Введите текст.');

rl.on('line', (input) => {
  if (input === 'exit' || input === 'SIGINT') {
    rl.close();
  }
  if (input !== 'exit') {
    textFile.write(`${input}\n`);
  }
}
);

rl.on('close', () => console.log('Все-го хо-ро-ше-го!'));