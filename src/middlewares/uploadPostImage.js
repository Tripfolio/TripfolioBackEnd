const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");
const path = require("path");

const uploadPostImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const filename = `cover-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
});
<<<<<<< HEAD
module.exports = uploadPostImage;
=======
module.exports = uploadPostImage;
>>>>>>> d0c0adf4b7ec8be473a7b5354b1b2776fde91a6d
