const express = require('express');
const app = express();
const PORT = 8001
const { connectToDB } = require("./connect");
const path = require("path");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const staticRouter = require("./routes/staticRouter");

connectToDB("mongodb://127.0.0.1:27017/short-url").then(() => console.log("Connected to DB"))

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views",))


app.get('/test', async(req, res) => {
    const allURL = await URL.find({});
    return res.render("home")

})

app.use(express.json());
app.use(express.urlencoded({ extended:  false }));



app.use('/url', urlRoute);


app.use("/", staticRouter);

app.get('/url/:shortId', async (req, res) => {
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