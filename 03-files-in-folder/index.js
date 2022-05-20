const fs = require('fs');
const path = require('path');

fs.readdir(path.join( __dirname, 'secret-folder'),  {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  }
  else {
    for (let file of files) {
      if (file.isFile()) {
        fs.stat(path.join( __dirname, 'secret-folder', file.name), (err, stats) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log(path.parse(file.name).name + ' - ' + path.parse(file.name).ext.replace(/['.']/,'') + ' - ' + stats.size + ' byte');
          }
        });
      }
    }
  }
});
