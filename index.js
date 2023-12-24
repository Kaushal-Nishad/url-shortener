const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');
require('dotenv').config();

const app = express();

//Mongoose Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongodb Connected!");
    }).catch((err) => {
        console.log(`Error ${err}`)
    });

//Mongoose schema
const urlSchema = mongoose.Schema({

    originalUrl: {
        type: String,
    },
    shortedUrl: {
        type: String,
    }
}, {
    timestamp: true,
});
//Mongoose model
const Url = mongoose.model("Url", urlSchema);

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortedUrl = shortId.generate();
    const newUrl=new Url({
        originalUrl,
        shortedUrl,
    });
    await newUrl.save();
    return res.status(201).json({originalUrl,shortedUrl});
});
app.get('/:shortId', async (req, res) => {
    const {shortId }=req.params;
    const url = await Url.findOne({shortedUrl: shortId});
    if(url){
        return res.redirect(url.originalUrl);
    }else{
        return res.status(404).json({error: "Url not Found!"});
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});