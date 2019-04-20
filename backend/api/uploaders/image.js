const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) =>  {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
   cb(null, true); //save the file
  } else {
    cb(null, false); // not save the file
  }
};

module.exports = multer({
  storage,
  fileFilter
});
