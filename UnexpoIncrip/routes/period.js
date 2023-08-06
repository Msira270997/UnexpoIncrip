var express = require('express');
var router = express.Router();
var periodDB = require('../db/period')
var subjectDB = require('../db/subject')
var teacherDB = require('../db/teacher')

router.get('/', async function (req, res) { // req = request, res = response
    var period_db = new periodDB.Period();

    var periods = await period_db.filter({});
    res.render('period/list', {
        title: "Periodos academicos",
        periods: periods
    });

})


router.get('/new/', async function (req, res) { // req = request, res = response


    res.render('period/new', {
        title: "Nueva Periodo academico"
    });

})

router.post('/new', async function (req, res) {


    var period_db = new periodDB.Period();
    await period_db.create({
        name: req.body.name
    });

    res.redirect('/period');
})

router.get('/subject/:period_id', async function (req, res) { // req = request, res = response
    var period_db = new periodDB.Period();

    var list = await period_db.filter_subject({ period_id: req.params.period_id });
    res.render('period/list_subject', {
        title: "Materias por periodos academicos",
        list: list,
        period_id: req.params.period_id
    });

})

router.get('/subject/new/:period_id', async function (req, res) { // req = request, res = response

    var teacher_db = new teacherDB.Teacher();
    var subject_db = new subjectDB.Subject();

    let teachers = await teacher_db.filter({});
    let subjects = await subject_db.filter({});

    res.render('period/new_subject', {
        title: "Asignar materia a periodo academico",
        teachers: teachers,
        subjects: subjects,
        period_id: req.params.period_id,
        model: null
    });

})

router.post('/subject/new', async function (req, res) {


    var period_db = new periodDB.Period();
    var teacher_db = new teacherDB.Teacher();
    var subject_db = new subjectDB.Subject();

    let teachers = await teacher_db.filter({});
    let subjects = await subject_db.filter({});
    let model = {
        teacher_id: req.body.teacher_id,
        subject_id: req.body.subject_id,
        classroom: req.body.classroom,
        section: req.body.section
    };

    if (!req.body.period_id || !req.body.teacher_id || !req.body.subject_id || !req.body.classroom || !req.body.section) {
        res.render('period/new_subject', {
            title: "Asignar materia a periodo academico",
            teachers: teachers,
            subjects: subjects,
            period_id: req.body.period_id,
            model: model,
            message: "Datos incompletos"
        });

        return;
    }

    var item = await period_db.single_subject({
        period_id: req.body.period_id,
        teacher_id: req.body.teacher_id,
        subject_id: req.body.subject_id,
    });

    if (item) {
        res.render('period/new_subject', {
            title: "Asignar materia a periodo academico",
            teachers: teachers,
            subjects: subjects,
            period_id: req.body.period_id,
            model: model,
            message: "Ya se ha asiganado el profesor a la materia"
        });

        return;
    }

    await period_db.create_subject({
        period_id: req.body.period_id,
        teacher_id: req.body.teacher_id,
        subject_id: req.body.subject_id,
        classroom: req.body.classroom,
        section: req.body.section
    });

    res.redirect('/period/subject/' + req.body.period_id);
})

router.post('/subject/delete', async function (req, res) {

    var period_db = new periodDB.Period();

    if (req.body.id)
        await period_db.delete_subject({
            id: req.body.id
        });

    res.send(JSON.stringify({ code: 0 }));
})






module.exports = router;