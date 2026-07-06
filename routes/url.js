const express = require("express");
const router = express.Router();
const URL = require("../models/url")
const {handleGenerateNewShortURL,
    handleGetAnalytics,
handleDuplicateUrl} = require("../controllers/url");

router.post("/", handleGenerateNewShortURL);
router.get('/analytics/:shortId', handleGetAnalytics);



module.exports = router;
