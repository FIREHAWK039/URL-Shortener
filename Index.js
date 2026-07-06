const express = require('express');
const app = express();
const PORT = 8001
const { connectToDB } = require("./connect");
const path = require("path");
const URL = require("./models/url");
const cookieParser = require("cookie-parser")
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRoute = require("./routes/user")
const {restrictToLoggedinOnlyUser, checkAuth} = require("./middleware/auth")


connectToDB("mongodb://127.0.0.1:27017/short-url").then(() => console.log("Connected to DB"))




app.set('view engine', 'ejs');
app.set('views', path.resolve("./views",))




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render("home",{
        urls: allUrls, 
    })
});

app.use('/url', restrictToLoggedinOnlyUser,  urlRoute);
app.use('/user', userRoute);
app.use("/", checkAuth, staticRouter);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const Entry = await URL.findOneAndUpdate(
        {
            shortId 
        }, { 
        $push: {
            visitHistory: { timestamp: Date.now() }
        },
    }
    )
     if (!Entry) {
        return res.status(404).json({ error: "Short URL not found" });
     }
    res.redirect(Entry.redirectUrl)
})

app.get("/users/:id", async (req, res) => {
    return res.render("home")
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));