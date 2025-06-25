/*const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');
const path = require('path');

/**
 * 建立通用 S3 上傳 middleware
 * @param {string} prefix 檔名前綴（如 avatar、cover、post）
 * @returns multer middleware
 */
/*function createS3Uploader(prefix) {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const filename = `${prefix}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
      },
    }),
  });
}

module.exports = createS3Uploader;*/
