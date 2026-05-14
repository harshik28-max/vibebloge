const multer = require("multer");

const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        if (
            file.mimetype.startsWith("image")
        ) {

            cb(null, "uploads/images");

        } else {

            cb(null, "uploads/videos");

        }

    },

    filename: function(req, file, cb) {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});

const upload = multer({
    storage
});

module.exports = upload;