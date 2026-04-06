const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|gif|webp/;
    const ext = types.test(path.extname(file.originalname).toLowerCase());
    ext ? cb(null, true) : cb(new Error("Chỉ chấp nhận file ảnh"));
  },
});

module.exports = upload;
