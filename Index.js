const express = require('express');
const app = express();
const PORT = 8001
const { connectToDB } = require("./connect");

const urlRoute = require("./routes/url");
const URL = require("./models/url");

connectToDB("mongodb://127.0.0.1:27017/short-url")
    .then(() => console.log("Connected to DB"))

app.use(express.json());
app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const Entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: { timestamp: Date.now() }
        },
    }
    )
    res.redirect(Entry.redirectUrl)
})



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));