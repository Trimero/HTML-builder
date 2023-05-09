const fs = require('fs');
const readline = require('readline');
const path = require('path');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function enterYouText() {
  rl.question('Введите ваш текст: ', (answer) => {
    if (answer === 'exit') {
      exit();
    } else {
      fs.appendFile(path.join(__dirname, 'text.txt'), answer + '\n', (err) => {
        if (err) {
          throw err;
        }
        enterYouText();
      });
    }
  });
}

function exit() {
  console.log('\nВсего хорошего!');
  process.exit();
}
enterYouText();
rl.on('close', exit);


