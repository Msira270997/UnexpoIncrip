var express = require('express');
var router = express.Router();
var inscriptionsDB = require('../db/inscriptions');
var studentDB = require('../db/student');
var periodDB = require('../db/period');
var subjectDB = require('../db/subject')
var teacherDB = require('../db/teacher')


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

router.get('/subject/:inscription_id', async function (req, res) {
    var inscriptions_db = new inscriptionsDB.Inscriptions();
    var subject_db = new subjectDB.Subject();
    var teacher_db = new teacherDB.Teacher();

    var inscription_details = await inscriptions_db.filter_subject_period({inscription_id: req.params.inscription_id});
    var inscriptions = await inscriptions_db.filter({id: req.params.inscription_id});
    let inscription_period = inscriptions[0].period_id;
    let inscription_student = inscriptions[0].student;
    let subject = [];
    let teacher = [];
    for(i = 0; i < inscription_details.length; i++){
        subject.push({
            subject: await subject_db.filter({id: inscription_details[i].subject_id})
        })
        teacher.push({
            teacher: await teacher_db.filter({id: inscription_details[i].teacher_id})
        })
    }
    res.render('inscriptions/list_subjects', {
        wellcome: "Hola " + inscription_student,
        title: "Listado de materias para inscribir",
        inscription_details: inscription_details,
        inscription_id: req.params.inscription_id,
        inscription_period: inscription_period,
        subject: subject,
        teacher: teacher
    })
})

router.post('/subject/add', async function (req, res) {

    var inscriptions_db = new inscriptionsDB.Inscriptions();

    if (req.body.inscription_id && req.body.aps_id)
        await inscriptions_db.add_subject({
            inscription_id: req.body.inscription_id,
            acad_per_subj_id: req.body.aps_id
        });

    res.send(JSON.stringify({ code: 0 }));
})

router.post('/subject/delete', async function (req, res) {

    var inscriptions_db = new inscriptionsDB.Inscriptions();

    if (req.body.id)
        await inscriptions_db.delete_subject({
            id: req.body.id
        });

    res.send(JSON.stringify({ code: 0 }));
})

router.post('/subject/finish', async function (req, res) {

    var inscriptions_db = new inscriptionsDB.Inscriptions();

    if (req.body.inscription_id){
        await inscriptions_db.update({id: req.body.inscription_id});
    }

    res.send(JSON.stringify({ code: 0 }));
})


module.exports = router;
