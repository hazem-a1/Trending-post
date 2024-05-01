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
});

router.get('/migrate', async (req: express.Request, res: express.Response) => {

    const cursor = await blogPostDAO.read()

    const toMigrate = cursor.map(({ _id }) => ({
        updateOne: {
            filter: { _id: new ObjectId(_id) },
            update: {
                $set: {
                    lastupdated: Date.now(),
                    published: false,
                    country_iso: "US",

                },
            },
        },
    }))
    console.log(
        "\x1b[32m",
        `Found ${toMigrate.length} documents to update`,
    )
    // TODO: Complete the BulkWrite statement below
    const { modifiedCount } = await blogPostDAO
        .bulkWrite(toMigrate)

    console.log("\x1b[32m", `${modifiedCount} documents updated`)
    res.json({ message: "Migration completed" });
});

// TODO: 1- optimize performance by using a queue to generate blog posts
// this will not work on serverless environments like AWS lambda
// 2- add a cron job to generate blog posts every 24 hours this will help to keep the blog posts up to date using uptime robot.
router.get('/generate', async (req: express.Request, res: express.Response) => {
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
    await blogPostDAO.insertMany(TrendingBlogPosts);
    res.json({
        message: "Trending blog posts generated",
    });
});


// GET a specific blog post
router.get('/:id', async (req: express.Request, res: express.Response) => {
    const post = await blogPostDAO.read({ id: req.params.id });
    res.json(post);
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






export default router;