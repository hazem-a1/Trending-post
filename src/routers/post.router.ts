import express = require('express');
import { TrendBlogPostDAO } from '../DAO/postDAOs';
import { generateBlogPost } from '../services/gemini/generateBlogPost';
import { mapRequestToTrend } from '../services/gemini/mapRequestToTrend';
import { fetchTrendingSearches } from '../services/google-trend/fetchTrendingSearches';
import { TrendBlogPost } from '../common/GoogleTrend.interface';
import { ObjectId, Sort } from 'mongodb';
import { ISO3166Alpha2 } from '../common/countriesIsoCode.type';

const router = express.Router();
const blogPostDAO = new TrendBlogPostDAO();

// GET all blog posts
router.get('/', async (req: express.Request, res: express.Response) => {
    try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const sort = req.query.sort as string || 'date';
    const order = req.query.order as string || 'desc';
    const filter = req.query.filter as string || '{}';

    const skip = (page - 1) * size;
    const sortObj: Sort = { [sort]: order === 'desc' ? -1 : 1 };
    const filterObj = JSON.parse(filter);

    const posts = await blogPostDAO.read(filterObj, { skip, limit: size, sort: sortObj })
    const total = await blogPostDAO.count(filterObj);
    res.json({ posts, total, page, size });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
});

// Get /search?text=keyword
router.get('/search', async (req: express.Request, res: express.Response) => {
    try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const sort = req.query.sort as string || 'date';
    const order = req.query.order as string || 'desc';
    const filter = req.query.filter as string || '{}';

    const skip = (page - 1) * size;
    const sortObj: Sort = { [sort]: order === 'desc' ? -1 : 1 };
    const filterObj = JSON.parse(filter);
    const text = req.query.text as string || '';
    const posts = await blogPostDAO.search(text, filterObj, { skip, limit: size, sort: sortObj });
    res.json({ posts, page, size });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
});

// TODO: 1- optimize performance by using a queue to generate blog posts
// this will not work on serverless environments like AWS lambda
// 2- add a cron job to generate blog posts every 24 hours this will help to keep the blog posts up to date using uptime robot.
router.get('/generate', async (req: express.Request, res: express.Response) => {
    try {
        
    // check if the request is authorized
    if (req.headers.authorization !== process.env.GENERATOR_BASIC_AUTH) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const TrendingBlogPosts: Array<TrendBlogPost> = [];

    const country_iso = req.query.country as ISO3166Alpha2 || "US";

    const trendingFetched = await fetchTrendingSearches({
        country_iso: country_iso,
        category: "all",
    });

    const trending = mapRequestToTrend(trendingFetched);

    for await (const trend of trending) {

        const existingPost = await blogPostDAO.findOne({ title: trend.title });

        // insure that the post is not already generated
        if (!existingPost) {
            const blogPost = await generateBlogPost(trend.title);
            TrendingBlogPosts.push({
                ...trend,
                blogPost,
                published: false,
                country_iso,
                lastupdated: Date.now(),
            });
        }
    }
    // save to db
    if (TrendingBlogPosts.length === 0) {
        res.json({
            message: "No new blog posts generated",
        });
        return;
    }
    await blogPostDAO.insertMany(TrendingBlogPosts);
    res.json({
        message: "Trending blog posts generated",
    });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});       
    }
});


// GET a specific blog post
router.get('/:id', async (req: express.Request, res: express.Response) => {
    try {
    const post = await blogPostDAO.findOne({ _id: new ObjectId(req.params.id) });
    if (!post) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
});


export default router;