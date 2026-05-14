const Comment = require("../models/Comment");
const Post = require("../models/Post");

/* ADD COMMENT */

const addComment = async(req, res) => {

    try {

        const post =
            await Post.findById(req.params.postId);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }

        const comment =
            await Comment.create({

                user: req.user._id,

                post: req.params.postId,

                text: req.body.text

            });

        post.comments.push(comment._id);

        await post.save();

        res.status(201).json(comment);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* DELETE COMMENT */

const deleteComment = async(req, res) => {

    try {

        const comment =
            await Comment.findById(req.params.id);

        if (!comment) {

            return res.status(404).json({
                message: "Comment not found"
            });

        }

        await comment.deleteOne();

        res.json({
            message: "Comment deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    addComment,
    deleteComment

};