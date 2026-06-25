const express = require("express");
const router = express.Router();

router.get("/", (req, res) => { 
    return res.render("home");
})
router.post("/url/:shortid/about", (req, res) => { 
    return res.redirect("");
})




module.exports = router;


