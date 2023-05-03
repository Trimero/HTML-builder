const fs = require('fs');
const path = require('path');

fs.ReadStream(path.resolve(__dirname, 'text.txt')).pipe(process.stdout);
