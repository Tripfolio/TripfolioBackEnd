// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const s3 = require('../config/s3');
// const path = require('path')

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.AWS_S3_BUCKET,
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         key: (req, file, cb) => {
//             const filename = `avatar-${Date.now()}${path.extname(file.originalname)}`;
//             cb(null, filename);
//         },
//     })
// });
// module.exports = upload;

//這段記得恢復
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

module.exports = upload;