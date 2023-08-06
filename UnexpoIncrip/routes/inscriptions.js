var express = require('express');
var router = express.Router();
var inscriptionsDB = require('../db/inscriptions');
var studentDB = require('../db/student');
var periodDB = require('../db/period');


router.get('/', async function (req, res) { // req = request, res = response
    var inscriptions_db = new inscriptionsDB.Inscriptions();

    var inscriptions = await inscriptions_db.filter({});
    res.render('inscriptions/list', {
        title: "Inscripciones",
        inscriptions: inscriptions
    });

})

router.get('/new/', async function (req, res) { // req = request, res = response
    var student_db = new studentDB.Student();
    var period_db = new periodDB.Period();

    var students = await student_db.filter({});
    var periods = await period_db.filter({});
    res.render('inscriptions/new', {
        title: "Inscripciones",
        students: students,
        periods: periods
    });

})

router.post('/new', async function (req, res) {

    var inscriptions_db = new inscriptionsDB.Inscriptions();
    await inscriptions_db.create({
        student_id: req.body.student,
        period_id: req.body.period,
        detail: req.body.detail
    });

    res.redirect('/inscriptions');
})


module.exports = router;
