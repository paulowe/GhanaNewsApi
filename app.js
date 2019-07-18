const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const {FetchNews} = require('./service/NewsService');
const cron = require('node-cron');
const newsRouter = require('./routes/news');
const config = require('config');
const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/news', newsRouter);

//default route
app.get('/', (req, res)=>{
    res.send("Welcome to the news api. Access news content from /news. You may access all news with /news/all or sports news with /news/sport");
});

mongoose.connect(config.get("mongoUri"), {useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

// FetchNews();

//run this task everyday at 13:20 GMT
const task = cron.schedule('20 13 * * * *', async () => {
    console.log('Fetching news items');
    try {
        await FetchNews()
    } catch (error) {
        console.log('Error executing cron job');
    }
});


task.start();

module.exports = app;
