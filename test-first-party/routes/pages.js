const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
router.get('/',authController.isLoggedIn, (req, res) => {
    res.sendFile("main.html", { root: './login-public/' })
});
router.get('/register', (req, res) => {
    res.sendFile("register.html", { root: './login-public/' })
});
router.get('/login', (req, res) => {
    res.sendFile("login.html", { root: './login-public/' })
});
router.get('/profile', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.sendFile("profile.html", { root: './login-public/' })
    } else {
        res.sendFile("login.html", { root: './login-public/' });
    }
})
module.exports = router;