const express = require("express");
const router = express.Router();
const URL = require("../models/url")
const {handleGenerateNewShortURL,
    handleGetAnalytics,
    handelDeleteUserById} = require("../controllers/url");

router.post("/", handleGenerateNewShortURL);
router.get('/analytics/:shortId', handleGetAnalytics);
router.delete("/users/:id", handelDeleteUserById)


router.get('/manage', async (req, res) => {
    try {
        const urls = await URL.find({});
        res.render('delete', { urls, message: null, success: req.query.success === 'true' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/delete', async (req, res) => {
    const { shortId } = req.body;
    try {
        const deleted = await URL.findOneAndDelete({ shortId });
        if (!deleted) {
            const urls = await URL.find({});
            return res.render('delete', { urls, message: 'URL not found!', success: false });
        }
        res.redirect('/url/manage?success=true');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/delete-all', async (req, res) => {
    try {
        await URL.deleteMany({});
        res.redirect('/url/manage?success=true');
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
