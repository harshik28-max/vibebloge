const express = require("express");

const router = express.Router();

const {

    getUserProfile,
    followUser

} = require("../controllers/profileController");

const protect =
    require("../middleware/authMiddleware");

/* GET PROFILE */

router.get(
    "/:username",
    getUserProfile
);

/* FOLLOW USER */

router.put(
    "/follow/:id",
    protect,
    followUser
);

module.exports = router;