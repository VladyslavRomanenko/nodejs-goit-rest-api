const multer = require("multer");
const path = require("path");
const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 10,
};

const upload = multer({
  storage,
  limits,
});

module.exports = upload;
