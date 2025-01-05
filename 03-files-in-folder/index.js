const fs = require('node:fs');
const path = require('node:path');
const pathToDir = path.join(__dirname, 'secret-folder');

fs.readdir(pathToDir, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Error reading directory: ', err);
    return;
  }
  files.forEach((file) => {
    if (!file.isFile()) return;
    const pathToFile = path.join(pathToDir, file.name);

    fs.stat(pathToFile, (err, stats) => {
      if (err) {
        console.error('Error getting stats: ', err);
        return;
      }
      const fileExtension = path.extname(file.name);
      const fileName = path.basename(pathToFile, fileExtension);
      const fileSize = (stats.size / 1024).toFixed(3);

      console.log(`${fileName} - ${fileExtension.slice(1)} - ${fileSize}kb`);
    });
  });
});
