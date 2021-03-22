//routes for industry

const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const slugify = require('slugify')
const db = require("../db");


router.get('/', async (req, res, next) => {
    try{
    const results = await db.query(
        `SELECT i.code, i.industry, array_agg(c.name)
        FROM industries AS i
        LEFT JOIN  company_industry AS ci
        ON i.code = ci.industry_id
        LEFT JOIN companies AS c
        ON ci.companies_code = c.code
        GROUP BY i.code`);
        return res.send({ industries: results.rows })
    }catch(e){
        return next(e);
    }
});

router.post('/', async (req, res, next) => {
    try{
        const { industry } = req.body;
        const code = slugify(industry, { lower: true})
        const results = await db.query(`INSERT INTO industries (industry, code)
            VALUES ($1, $2)
            RETURNING industry, code`,
            [industry, code]);
        return res.status(201).json({ industry: results.rows[0] })
    } catch(e) {
        return next(e)
    }
})

router.post('/:industry', async (req, res, next) => {
    try{
        const { industry } = req.params;
        const industry_id =slugify(industry, { lower: true})
        const { companies_code } = req.body;
        const results = await db.query(`INSERT INTO company_industry (companies_code, industry_id)
            VALUES ($1, $2)
            RETURNING companies_code, industry_id`,
            [companies_code, industry_id]);
        return res.status(201).json({ company_industry: results.rows[0] })
    } catch(e) {
        return next(e)
    }
})

module.exports = router;