const { mkdir, copyFile, readdir, rm } = require('node:fs/promises');
const path = require('node:path');

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
        await toCopyFile(srcPath, destPath);
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
const currDir = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');

copyDir(currDir, newDir);
