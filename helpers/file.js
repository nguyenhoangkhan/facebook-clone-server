const fs = require("fs");

class File {
  removeFile(path) {
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
  }
}
module.exports = new File();
