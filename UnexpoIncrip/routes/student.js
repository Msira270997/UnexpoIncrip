var express = require('express');
var router = express.Router();
var studentDB = require('../db/student')



router.get('/', async function (req, res) { // req = request, res = response
    var student_db = new studentDB.Student();

    var students = await student_db.filter({});
    res.render('student/list', {
        title: "Estudiantes",
        students: students
    });

})


router.get('/new/', async function (req, res) { // req = request, res = response
    var student_db = new studentDB.Student();

    var specialties = await student_db.filter_specialty();
    res.render('student/new', {
        title: "Nuevo Estudiante",
        specialties: specialties
    });

})

router.post('/new', async function (req, res) {


    var student_db = new studentDB.Student();
    await student_db.create({
        email: req.body.email,
        name: req.body.name,
        specialty_id: req.body.specialty
    });

    res.redirect('/student');
})

router.get('/update/:id', async function (req, res) { // req = request, res = response
    var student_db = new studentDB.Student();

    var specialties = await student_db.filter_specialty();
    var student = await student_db.single({ id: req.params.id });

    res.render('student/update', {
        title: "Update Estudiante",
        student: student,
        specialties: specialties
    });

})

router.post('/update', async function (req, res) {


    if(!req.body.id){
        res.redirect('/student');
        return;    
    }
    
    var student_db = new studentDB.Student();
    await student_db.update({
        email: req.body.email,
        name: req.body.name,
        specialty_id: req.body.specialty
    }, {
        id: req.body.id
    });

    res.redirect('/student');
})


module.exports = router;