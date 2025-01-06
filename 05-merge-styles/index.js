const { readdir, readFile, writeFile } = require('node:fs/promises');
const path = require('node:path');

async function mergeStyles(src, dist) {
  try {
    const folderFiles = await readdir(src, { withFileTypes: true });
    const cssFiles = folderFiles.filter((file) => path.extname(file.name) === '.css' && file.isFile());

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
    
    const bundle = path.join(dist, 'bundle.css');
    await writeFile(bundle, stylesArr.join('\n'));

  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('Folders "styles" or "project-dist" does not exist');
    } else {
      console.error('Error merging styles: ', err)
    }
  }
}

const pathToSrc = path.join(__dirname, 'styles');
const pathToDist = path.join(__dirname, 'project-dist');

mergeStyles(pathToSrc, pathToDist);