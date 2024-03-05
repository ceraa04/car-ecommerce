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
    res.render("signup", {
        messages: {
            error: req.flash("error")
        }
    });
});

router.post("/signup", async (req, res, next) => {
    try {
        // Salt je broj dodatnih random karaktera koje ce bcrypt funkcija dodati
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            req.flash("error", "Username already exists");
            res.redirect("/signup");
            return;
        }
        else if (req.body.password.length < 4) {
            req.flash("error", "Password has to have at least 4 letters");
            res.redirect("/signup");
            return;
        }
        else if (req.body.password.toLowerCase() === req.body.username.toLowerCase()) {
            req.flash("error", "Password cannot be the same as username!");
            res.redirect("/signup");
            return;
        }
        else if (req.body.password !== req.body.repeatedPassword) {
            req.flash("error", "Passwords must match");
            res.redirect("/signup");
            return;
        }
        let hasUpperCase = false;
        let hasLowerCase = false;

        for (let i = 0; i < req.body.password.length; i++) {
            if (req.body.password[i] === req.body.password[i].toUpperCase()) {
                hasUpperCase = true;
            } else if (req.body.password[i] === req.body.password[i].toLowerCase()) {
                hasLowerCase = true;
            }

            // Ako su oba slucaja pronadjena, izadji iz loopa
            if (hasUpperCase && hasLowerCase) {
                break;
            }
        }

        if (!hasUpperCase || !hasLowerCase) {
            req.flash("error", "Password has to have at least 1 uppercase and 1 lowercase letter");
            return res.redirect("/signup");
        }

        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        res.redirect("/signin");
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
