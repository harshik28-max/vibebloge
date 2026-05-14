const User = require("../models/User");
const bcrypt = require("bcryptjs");

const generateToken =
    require("../utils/generateToken");

/* REGISTER */

const registerUser = async(req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        const userExists =
            await User.findOne({ email });

        if (userExists) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        const salt =
            await bcrypt.genSalt(10);

        const hashedPassword =
            await bcrypt.hash(password, salt);

        const user =
            await User.create({

                username,
                email,
                password: hashedPassword

            });

        res.status(201).json({

            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* LOGIN */

const loginUser = async(req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email });

        if (
            user &&
            await bcrypt.compare(
                password,
                user.password
            )
        ) {

            res.json({

                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)

            });

        } else {

            res.status(401).json({
                message: "Invalid credentials"
            });

        }

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* PROFILE */

const getProfile = async(req, res) => {

    try {

        const user =
            await User.findById(req.user._id);

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    registerUser,
    loginUser,
    getProfile

};