const shortid  = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
   try {
     const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const shortID = shortid();

    await URL.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });

    return res.render("home",{id: shortID })
    
   } catch (error) {
     if (error.code === 11000) {
            // duplicate redirectUrl — fetch the existing one
            const existing = await URL.findOne({  redirectUrl: req.body.url });
            return res.status(200).json({
                shortId: existing.shortId,
                message: "This URL was already shortened"
                
            });
        }
    
   }
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId})
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
     }); 
    }









module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    };