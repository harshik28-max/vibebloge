const express = require("express");

const router = express.Router();

const {

    createPost,
    getPosts,
    deletePost,
    likePost

} = require("../controllers/postController");

const protect =
    require("../middleware/authMiddleware");

const upload =
    require("../middleware/uploadMiddleware");

/* GET POSTS */

router.get(
    "/",
    getPosts
);

/* CREATE POST */

router.post(
    "/",
    protect,
    upload.single("media"),
    createPost
);

/* DELETE POST */

router.delete(
    "/:id",
    protect,
    deletePost
);

/* LIKE POST */

router.put(
    "/like/:id",
    protect,
    likePost
);

module.exports = router;