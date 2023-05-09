const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

fs.access(path.join(__dirname, 'text.txt'), (err) => {
  if (err) {
    fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
      if (err) throw err;
    });
  }
});

function enterYourText() {
  rl.question('Введите ваш текст: ', (answer) => {
    if (answer === 'exit') {
      rl.close();
    } else {
      fs.appendFile(path.join(__dirname, 'text.txt'), answer + '\n', (err) => {
        if (err) throw err;
        enterYourText();
      });
    }
  });
}

function exit() {
  console.log('\nВсего хорошего!');
  process.exit();
}

enterYourText();
rl.on('close', exit);

