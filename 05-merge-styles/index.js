const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => 
{if (err) {
  throw err;
} else {
  const bundleCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
  for (let file of files) {
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      const stream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
      stream.on('data', chunk => bundleCss.write(chunk));
      stream.on('error', error => console.log('Error', error.message));
    }
  }
}
});