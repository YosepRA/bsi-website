const path = require('path');

exports.download = function download(req, res) {
  const {
    params: { fileName },
  } = req;

  const root = path.join(__dirname, '../public/file');

  res.download(fileName, { root });
};
