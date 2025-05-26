
const MulterImageHandler = (uploader) => {
  return (req, res, next) => {
    uploader(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message || 'File upload error',
        });
      }
      next();
    });
  };
};

const MulterFileHandler = (uploader) => {
  return (req, res, next) => {
    uploader(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message || 'File upload error',
        });
      }
      next();
    });
  };
};

export {
  MulterImageHandler,
  MulterFileHandler
}