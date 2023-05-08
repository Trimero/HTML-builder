const fs = require('fs/promises');
const path = require('path');
const sourceDir = path.join(__dirname, 'assets');
const targetDir = path.join(__dirname, 'project-dist', 'assets');


async function createDistFolder() {
  const distDir = path.join(__dirname, 'project-dist');
  try {
    await fs.mkdir(distDir);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}


async function modifyTemplateFile() {
  const templateFile = path.join(__dirname, 'template.html');
  const template = await fs.readFile(templateFile, 'utf-8');
  const componentsDir = path.join(__dirname, 'components');
  const componentFiles = await fs.readdir(componentsDir);
  let modifiedTemplate = template;

  await Promise.all(componentFiles.map(async (filename) => {
    const componentPath = path.join(componentsDir, filename);
    const componentName = path.parse(filename).name;
    const componentContent = await fs.readFile(componentPath, 'utf-8');
    modifiedTemplate = modifiedTemplate.replace(new RegExp(`{{${componentName}}}`, 'g'), componentContent);
  }));

  const indexHtmlFilePath = path.join(__dirname, 'project-dist', 'index.html');
  await fs.writeFile(indexHtmlFilePath, modifiedTemplate);
}


async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const styleFiles = await fs.readdir(stylesDir);
  const styleContent = [];

  await Promise.all(styleFiles.map(async (filename) => {
    const stylePath = path.join(stylesDir, filename);
    const style = await fs.readFile(stylePath, 'utf-8');
    styleContent.push(style);
  }));

  const styleFilePath = path.join(__dirname, 'project-dist', 'style.css');
  await fs.writeFile(styleFilePath, styleContent.join('\n'));
}


async function copyDir() {
  try {
    await fs.mkdir(targetDir, { recursive: true });
    const files = await fs.readdir(sourceDir, { withFileTypes: true });
    const targetFiles = await fs.readdir(targetDir, { withFileTypes: true });
    for (let file of targetFiles) {
      if (!files.map(f => f.name).includes(file.name)) {
        const targetPath = path.join(targetDir, file.name);
        if (file.isDirectory()) {
          await fs.rmdir(targetPath, { recursive: true });
        } else {
          await fs.unlink(targetPath);
        }
      }
    }
    for (let file of files) {
      const sourcePath = path.join(sourceDir, file.name);
      const targetPath = path.join(targetDir, file.name);
      if (file.isDirectory()) {
        await copyDirRecursive(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
    fs.watch(sourceDir, { persistent: false }, async (eventType, filename) => {
      if (eventType === 'change') {
        const sourcePath = path.join(sourceDir, filename);
        const targetPath = path.join(targetDir, filename);
        await fs.copyFile(sourcePath, targetPath);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function copyDirRecursive(sourceDir, targetDir) {
  await fs.mkdir(targetDir, { recursive: true });
  const files = await fs.readdir(sourceDir, { withFileTypes: true });
  for (let file of files) {
    const sourcePath = path.join(sourceDir, file.name);
    const targetPath = path.join(targetDir, file.name);
    if (file.isDirectory()) {
      await copyDirRecursive(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}


async function build() {
  await createDistFolder();
  await modifyTemplateFile();
  await mergeStyles();
  await copyDir();
}

build().catch((error) => {
  console.error('Error during build:', error);
});