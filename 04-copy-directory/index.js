const fsPromises = require('fs/promises');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsPromises.mkdir(targetDir, { recursive: true });
    const files = await fsPromises.readdir(sourceDir);
    const targetFiles = await fsPromises.readdir(targetDir);
    for (let file of targetFiles) {
      if (!files.includes(file)) {
        const targetFile = path.join(targetDir, file);
        await fsPromises.unlink(targetFile);
      }
    }
    for (let file of files) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      await fsPromises.copyFile(sourceFile, targetFile);
    }
    fsPromises.watch(sourceDir, { persistent: false }, async (eventType, filename) => {
      if (eventType === 'change') {
        const sourceFile = path.join(sourceDir, filename);
        const targetFile = path.join(targetDir, filename);
        await fsPromises.copyFile(sourceFile, targetFile);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
copyDir();