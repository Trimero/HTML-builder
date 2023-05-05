
const fs = require('fs').promises;
const path = require('path');
const stylesDirPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function createBundle() {
  try {
    const stylesFileNames = await fs.readdir(stylesDirPath);

    let bundleContent = '';
    for (const fileName of stylesFileNames) {
      const filePath = path.join(stylesDirPath, fileName);
      const isDirectory = (await fs.stat(filePath)).isDirectory();

      if (!isDirectory && path.extname(fileName) === '.css') {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        bundleContent += fileContent;
      }
    }

    await fs.writeFile(bundleFilePath, bundleContent);

  } catch (err) {
    console.error(`Ошибка создания файла bundle.css: ${err}`);
  }
}

createBundle();