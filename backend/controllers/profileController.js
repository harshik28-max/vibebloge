const User = require("../models/User");
const Post = require("../models/Post");

/* GET PROFILE */

const getUserProfile = async(req, res) => {

    try {

        const user =
            await User.findOne({
                username: req.params.username
            }).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const posts =
            await Post.find({
                author: user._id
            });

        res.json({

            user,
            posts

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* FOLLOW USER */

const followUser = async(req, res) => {

    try {

        const userToFollow =
            await User.findById(req.params.id);

        const currentUser =
            await User.findById(req.user._id);

        if (!userToFollow) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const alreadyFollowing =
            currentUser.following.includes(
                userToFollow._id
            );

        if (alreadyFollowing) {

            currentUser.following =
                currentUser.following.filter(
                    id =>
                    id.toString() !==
                    userToFollow._id.toString()
                );

            userToFollow.followers =
                userToFollow.followers.filter(
                    id =>
                    id.toString() !==
                    currentUser._id.toString()
                );

        } else {

            currentUser.following.push(
                userToFollow._id
            );

            userToFollow.followers.push(
                currentUser._id
            );

        }

        await currentUser.save();
        await userToFollow.save();

        res.json({
            message: "Follow updated"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    getUserProfile,
    followUser

};