const multer  =require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './storage')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

  module.exports = {
    multer,
    storage
  }