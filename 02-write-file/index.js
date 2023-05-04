const fs = require('fs');
const readline = require('readline');
const path = require('path');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let text = '';

function writeFile(text) {
    fs.appendFile(path.join(__dirname, 'text.txt'), text, (err) => {
        if (err) {
            throw err;
        }
      });
}

function enterYouText() {
    rl.question('Введите ваш текст: ', (answer) => {
      if (answer === 'exit') {
          exit();
      } else {
        text += answer + '\n';
        writeFile(text);
        enterYouText();
      }
    });
  }

function exit() {
  console.log('\nВсего хорошего!');
  process.exit();
}

fs.writeFile(path.join(__dirname, 'text.txt'), text, (err) => {
  if (err) {
    throw err;
  }
  enterYouText();
});

rl.on('close', exit);

