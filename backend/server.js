const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

/* CONFIG */

dotenv.config();

/* DATABASE */

connectDB();

/* APP */

const app = express();

/* MIDDLEWARE */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* STATIC UPLOADS */

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

/* ROUTES */

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/posts",
    require("./routes/postRoutes")
);

app.use(
    "/api/comments",
    require("./routes/commentRoutes")
);

app.use(
    "/api/profile",
    require("./routes/profileRoutes")
);

/* HOME ROUTE */

app.get("/", (req, res) => {

    res.send("VibeBlog API Running");

});

/* PORT */

const PORT = process.env.PORT || 5000;

/* SERVER */

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});