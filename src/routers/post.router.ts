import express = require('express');
import { TrendBlogPostDAO } from '../DAO/postDAOs';
// import { generateBlogPost } from '../services/gemini/generateBlogPost';
// import { mapRequestToTrend } from '../services/gemini/mapRequestToTrend';
// import { fetchTrendingSearches } from '../services/google-trend/fetchTrendingSearches';
// import { TrendBlogPost } from '../common/GoogleTrend.interface';

const router = express.Router();
const blogPostDAO = new TrendBlogPostDAO();

// GET all blog posts
router.get('/', async (req: express.Request, res: express.Response) => {
    const posts = await blogPostDAO.read();
    res.json(posts);
});


// GET a specific blog post
router.get('/:id', async (req: express.Request, res: express.Response) => {
    const post = await blogPostDAO.read({ id: req.params.id });
    res.json(post);
});

// POST a new blog post
router.post('/', async (req: express.Request, res: express.Response) => {
    const newPost = await blogPostDAO.create(req.body);
    res.json(newPost);
});

// PUT update a blog post
router.put('/:id', async (req: express.Request, res: express.Response) => {
    const updatedPost = await blogPostDAO.update({ id: req.params.id }, req.body);
    res.json(updatedPost);
});

// DELETE a blog post
router.delete('/:id', async (req: express.Request, res: express.Response) => {
    const deletedPost = await blogPostDAO.delete({ id: req.params.id });
    res.json(deletedPost);
});


router.get('/generate', async (req: express.Request, res: express.Response) => {
    console.log(req.headers.authorization, process.env.GENERATOR_BASIC_AUTH);
    
    if (req.headers.authorization!== process.env.GENERATOR_BASIC_AUTH) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // const TrendingBlogPosts: Array<TrendBlogPost> = [];

    // const trendingFetched = await fetchTrendingSearches({
    //     country_iso: "US",
    //     category: "all",
    // });

    // const trending = mapRequestToTrend(trendingFetched);

    // for await (const trend of trending) {
    //     const blogPost = await generateBlogPost(trend.title);
    //     TrendingBlogPosts.push({ ...trend, blogPost });
    // }
    // // save to db
    // await blogPostDAO.insertMany(TrendingBlogPosts);
    return res.json({
        message: "Trending blog posts generated",
    });
});

export default router;