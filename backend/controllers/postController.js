const Post = require("../models/Post");

/* CREATE POST */

const createPost = async(req, res) => {

    try {

        let media = "";
        let mediaType = "";

        if (req.file) {

            media = req.file.path;
            mediaType = req.file.mimetype;

        }

        const post =
            await Post.create({

                author: req.user._id,

                content: req.body.content,

                media,
                mediaType

            });

        res.status(201).json(post);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* GET POSTS */

const getPosts = async(req, res) => {

    try {

        const posts =
            await Post.find()
            .populate("author", "username avatar")
            .populate("comments")
            .sort({ createdAt: -1 });

        res.json(posts);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* DELETE POST */

const deletePost = async(req, res) => {

    try {

        const post =
            await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }

        if (
            post.author.toString() !==
            req.user._id.toString()
        ) {

            return res.status(401).json({
                message: "Unauthorized"
            });

        }

        await post.deleteOne();

        res.json({
            message: "Post deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* LIKE POST */

const likePost = async(req, res) => {

    try {

        const post =
            await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }

        const alreadyLiked =
            post.likes.includes(req.user._id);

        if (alreadyLiked) {

            post.likes =
                post.likes.filter(
                    like =>
                    like.toString() !==
                    req.user._id.toString()
                );

        } else {

            post.likes.push(req.user._id);

        }

        await post.save();

        res.json(post);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    createPost,
    getPosts,
    deletePost,
    likePost

};