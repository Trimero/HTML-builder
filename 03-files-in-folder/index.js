
const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    fs.stat(path.join(folderPath, file), (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      if (!stats.isFile()) return;

      const fileSizeInKB = stats.size / 1024;
      const fileExtension = path.extname(file);
      const fileName = path.basename(file, fileExtension);

      console.log(`${fileName} - ${fileExtension} - ${fileSizeInKB.toFixed(3)}kb`);
    });
  });
});