const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/auth/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/auth/signup", async (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    if (!username || !password) {
        res.redirect("/auth/signup");
    } else {
        const userFromDB = await User.findOne({
            username
        });
        if (!userFromDB) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                username,
                password: hashedPassword,
            });
            res.render("user/profile", {
                user: createdUser
            });
        }
    }
});

router.get('/auth/login', (req, res) => {
    res.render('auth/login')
});

router.post("/auth/login", (req, res) => {
    const {
        username,
        password
    } = req.body;
    console.log("password", password);
    if (!username || !password) {
        res.redirect("/auth/signup");
    } else {
        User.findOne({
            username
        }).then((userFromDB) => {
            if (!userFromDB) {
                res.redirect("/auth/signup");
            } else if (bcrypt.compareSync(password, userFromDB.password)) {
                console.log("Passwords match");
                res.render("user/profile", {
                    user: userFromDB
                });
            } else {
                res.render("auth/login", {
                    errorMessage: "Incorrect login data"
                });
            }
        });
    }
});


module.exports = router;