//routes foro companies

const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const slugify = require('slugify')
const db = require("../db");

router.get('/', async (req, res, next) => {
    try{
    const results = await db.query(
        `SELECT * FROM companies`);
        return res.json({ companies: results.rows })
    }catch(e){
        return next(e);
    }
});

router.get('/:code', async (req, res, next) => {
    try{
        const { code } = req.params;
        const results = await db.query(
            `SELECT c.code, c.name, c.description, i.industry
            FROM companies AS c
            LEFT JOIN company_industry AS ci
            ON c.code = ci.companies_code
            LEFT JOIN industries AS i
            ON ci.industry_id = i.code
            WHERE c.code = $1`, [code])
            const {name, description} = results.rows[0];
            const industry = results.rows.map(r =>r.industry)
        if (results.rows.length === 0) {
            throw new ExpressError(` Can't find company with code of ${code}`)
        }
        return res.send({ code, name, description, industry})
        // return res.send({ company: results.rows })
    }catch(e){
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const code = slugify(name, { lower: true })
        const results = await db.query(`INSERT INTO companies (code, name, description) 
            VALUES ($1, $2, $3) 
            RETURNING code, name, description`, 
            [code, name, description]);
        return res.status(201).json({ company: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.patch('/:code', async (req, res, next) => {
    try{
        const { code } = req.params;
        const { name, description } =req.body;
        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code])
        console.log(results)
        if (results.rows.length === 0) {
            throw new ExpressError(` Cant update company with code of ${code}`, 404)
        }
        return res.send({ company: results.rows[0] })

    }catch(e){
        return next(e)
    }
})

router.delete('/:code', async (req, res, next) => {
    try{
        const results = db.query('DELETE FROM companies WHERE code = $1', [req.params.code])
        return res.send({ status: "DELETED!" })
    }catch(e){
        return next(e)
    }
})

module.exports = router;