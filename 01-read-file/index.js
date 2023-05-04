const fs = require('fs');
const path = require('path');

fs.ReadStream(path.join(__dirname, 'text.txt')).pipe(process.stdout);