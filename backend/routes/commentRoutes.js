const express = require("express");

const router = express.Router();

const {

    addComment,
    deleteComment

} = require("../controllers/commentController");

const protect =
    require("../middleware/authMiddleware");

/* ADD COMMENT */

router.post(
    "/:postId",
    protect,
    addComment
);

/* DELETE COMMENT */

router.delete(
    "/:id",
    protect,
    deleteComment
);

module.exports = router;