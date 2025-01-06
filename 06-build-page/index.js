const { mkdir, readFile, readdir, writeFile, rm, copyFile } = require('node:fs/promises');
const path = require('node:path');

async function createDir(path) {
  try {
    await mkdir(path, { recursive: true });
  } catch (err) {
    console.error('Error creating directory: ', err);
  }
}

const projectDistPath = path.join(__dirname, 'project-dist');
createDir(projectDistPath);

async function createHTML(src, dest, components) {
  try {
    let htmlContent = await readFile(src, 'utf8');
    const componentsDir = await readdir(components, { withFileTypes: true });

    for (const html of componentsDir) {
      const filePath = path.join(components, html.name);
      const fileName = path.parse(html.name).name;
      const fileContent = await readFile(filePath, 'utf8');

      htmlContent = htmlContent.replace(`{{${fileName}}}`, fileContent);
    }

    await writeFile(dest, htmlContent);
  } catch (err) {
    console.error('Error creating index.html: ', err);
  }
}

const srcHTMLPath = path.join(__dirname, 'template.html');
const destHTMLPath = path.join(projectDistPath, 'index.html');
const componentsPath = path.join(__dirname, 'components');

createHTML(srcHTMLPath, destHTMLPath, componentsPath);

async function mergeStyles(src, dest) {
  try {
    const folderFiles = await readdir(src, { withFileTypes: true });
    const cssFiles = folderFiles.filter(
      (file) => path.extname(file.name) === '.css' && file.isFile(),
    );

    const stylesArr = [];

    if (cssFiles.length === 0) {
      console.log('Folder does not contain css files');
      return;
    }

    for (const file of cssFiles) {
      const filePath = path.join(src, file.name);
      const content = await readFile(filePath, 'utf8');
      stylesArr.push(content);
    }

    const bundle = path.join(dest, 'style.css');
    await writeFile(bundle, stylesArr.join('\n'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('Folders "styles" or "project-dist" does not exist');
    } else {
      console.error('Error merging styles: ', err);
    }
  }
}

const pathToSrc = path.join(__dirname, 'styles');
const pathToDest = path.join(__dirname, 'project-dist');

mergeStyles(pathToSrc, pathToDest);

async function toCopyFile(src, dest) {
  try {
    await copyFile(src, dest);
  } catch (err) {
    console.error('Error copying file: ', err);
  }
}

async function copyDir(src, dest) {
  try {
    await rm(dest, { recursive: true, force: true });
    await mkdir(dest, { recursive: true });
    const srcDirFiles = await readdir(src, { withFileTypes: true });

    for (const file of srcDirFiles) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);

      if (file.isFile()) {
        await toCopyFile (srcPath, destPath);
      } else if (file.isDirectory()) {
        await copyDir(srcPath, destPath);
      }
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('Folder "files" does not exist');
    } else {
      console.error('Error copying dir: ', err);
    }
  }
}
const currDir = path.join(__dirname, 'assets');
const newDir = path.join(projectDistPath, 'assets');

copyDir(currDir, newDir);