const express = require('express');
const articleRouter = require('./routes/articles');
const mongoose = require('mongoose');
const Article = require('./models/Article.js');
const methodOverride = require('method-override');
const app = express();

// CONFIGURE DATABASE
//============================

//connect to db
// -- our database will be stored on our local machine
// -- mongoose.connect('mongodb://<HOSTNAME>/<DB NAME>');
// -- mongooose warns us to use the new url parser and unified topology by 
//    passing in config args as the second arg
// -- 
mongoose.connect('mongodb://localhost/blog', { 
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
 });


// CONFIGURE EXPRESS
//================================

// SETUP
// -------------
// set the view engine to ejs
app.set('view engine', 'ejs');
// allows express to parse our pages and extract the data it needs
app.use(express.urlencoded({ extended: false }));
// use method override
app.use(methodOverride('_method'));


// ROUTERS
// --------------
// tells express to insert /articles before all routes defined in the articleRouter file
app.use('/articles', articleRouter);



// index page - all articles
app.get('/', async (req, res)=>{
    // find all articles 
    articles = await Article.find({}).sort({createdAt: 'desc'});

    // render articles to articles index page
    res.render('articles/index', {articles: articles});
});


// LISTEN TO THE WEB
app.listen(3000);