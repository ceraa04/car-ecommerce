const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
// Sign-in route
router.get("/signin", (req, res) => {
    res.render("signIn", { message: req.flash("error")[0] });
});

router.post("/signin", passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true
}), (req, res) => {
    res.redirect("/");
});

// Sign-out route
router.get("/signout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

// Sign-up route
router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", async (req, res, next) => {
    try {
        // Salt je broj dodatnih random karaktera koje ce bcrypt funkcija dodati
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        res.redirect("/");
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
