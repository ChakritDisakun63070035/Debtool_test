const express = require("express")
const path = require("path")
router = express.Router()
const pool = require("../config")

router.get("/", async function (req, res, next) {
    try {
        const [rows, fields] = await pool.query("SELECT * FROM area")
        const [camera] = await pool.query("SELECT * FROM `area` join camera using(place)")
        return res.render("index", { area: JSON.stringify(rows) }, { cameras: JSON.stringify(camera) })
    } catch (err) {
        console.log(err)
        return next(err)
    }
})

router.get("/main_operation", async function (req, res, next) {
    try {
        const [area] = await pool.query("SELECT * FROM area")
        const [mission] = await pool.query("SELECT *,DATE_FORMAT(date_time, GET_FORMAT(DATETIME, 'ISO')) AS mission_date FROM `mission` join camera using(camera_name)")
        return res.render("main_operation", { area: JSON.stringify(area), mission: JSON.stringify(mission) },)
    } catch (err) {
        console.log(err)
        return next(err)
    }
})

router.get("/info_operation", async function (req, res, next) {
    try {
        const [rows, fields] = await pool.query("SELECT * FROM team")
        return res.render("info_operation", { teams: JSON.stringify(rows) })
    } catch (err) {
        console.log(err)
        return next(err)
    }
})

router.get("/select_team/:idmission", async function (req, res, next) {
    try {
        const [rows] = await pool.query("SELECT * FROM team", [req.params.idmission])
        const [mission] = await pool.query("SELECT *,DATE_FORMAT(date_time, GET_FORMAT(DATETIME, 'ISO')) AS mission_date FROM `mission` join camera using(camera_name) WHERE idmission=?", [req.params.idmission])
        return res.render("select_team", { teams: JSON.stringify(rows), mission: JSON.stringify(mission) },)
    } catch (err) {
        console.log(err)
        return next(err)
    }
})

router.get("/info_operation/:idmission", async function (req, res, next) {
    try {
        const [rows] = await pool.query("SELECT * FROM team", [req.params.idmission])
        const [mission] = await pool.query("SELECT *,DATE_FORMAT(date_time, GET_FORMAT(DATETIME, 'ISO')) AS mission_date FROM `mission` join camera using(camera_name) WHERE idmission=?", [req.params.idmission])
        return res.render("info_operation", { teams: JSON.stringify(rows), mission: JSON.stringify(mission) },)
    } catch (err) {
        return next(err)
    }
})

router.get('/addTeam/:name/:idmission', async function (req, res, next) {
    // console.log(req)
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        const rows1 = await conn.query(
            'UPDATE `mission` SET name=?, status=? WHERE idmission=?', [req.params.name, "pass", req.params.idmission]
        )
        console.log(rows1)
        await conn.commit()
        res.redirect("/main_operation")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

router.get('/delMis/:idmission', async function (req, res, next) {
    // console.log(req)
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        const rows1 = await conn.query(
            'UPDATE `mission` SET status=? WHERE idmission=?', ["del", req.params.idmission]
        )
        console.log(rows1)
        await conn.commit()
        res.redirect("/main_operation")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

router.get('/doneMis/:idmission', async function (req, res, next) {
    // console.log(req)
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        const rows1 = await conn.query(
            'UPDATE `mission` SET status=? WHERE idmission=?', ["done", req.params.idmission]
        )
        console.log(rows1)
        await conn.commit()
        res.redirect("/main_operation")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

router.get("/camera", async function (req, res, next) {
    try {
        return res.render("camera")
    } catch (err) {
        return next(err)
    }
});

exports.router = router