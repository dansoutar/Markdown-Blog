const express = require('express');
const router = express.Router();
const Article = require('../models/Article.js');



// new page - new article form
router.get('/new', (req, res)=>{
    res.render('articles/new', {article: new Article()});
});

// edit page - edit article form
router.get('/edit/:id', async (req, res)=>{
    const article = await Article.findById(req.params.id);

    res.render('articles/edit', { article: article });
});




// CRUD
//======================


// Create 
router.post('/', async (req, res, next)=>{
    req.article = await new Article();
    next();
}, saveArticleAndRedirect('new'));

// Read 
router.get('/:slug', async (req, res)=>{
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) { res.redirect('/'); }
    // render the show page for this article, with the db data passed in
    res.render('articles/show', { article: article }); 
});

// Update
router.put('/:id', async (req, res, next)=>{
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));

// Delete
router.delete('/:id', async(req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});



// FUNCTIONS
// ==========================

function saveArticleAndRedirect(path) {
    return async (req, res)=>{
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);       
        } catch(e) {
            console.log(e);
            res.render(`articles/${path}`, { article: article });
        }
    }
}

module.exports = router; 