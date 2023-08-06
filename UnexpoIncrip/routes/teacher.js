var express = require('express');
var router = express.Router();
var teacherDB = require('../db/teacher')

router.get('/', async function (req, res) { // req = request, res = response
    var teacher_db = new teacherDB.Teacher();

    var teachers = await teacher_db.filter({});
    res.render('teacher/list', {
        title: "Profesores", 
        teachers: teachers       
    });

})


router.get('/new/', async function (req, res) { // req = request, res = response
    
    
    res.render('teacher/new', {
        title: "Nuevo Profesor"       
    });

})

router.post('/new', async function (req, res) {


    var teacher_db = new teacherDB.Teacher();
    await teacher_db.create({
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
        phone: req.body.phone,
    });

    res.redirect('/teacher');
})


router.get('/update/:id', async function (req, res) { // req = request, res = response
    var teacher_db = new teacherDB.Teacher();

    
    var teacher = await teacher_db.single({ id: req.params.id });

    res.render('teacher/update', {
        title: "Update Estudiante",
        teacher: teacher       
    });

})

router.post('/update', async function (req, res) {


    if(!req.body.id){
        res.redirect('/teacher');
        return;    
    }
    
    var teacher_db = new teacherDB.Teacher();
    await teacher_db.update({
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
        phone: req.body.phone
    }, {
        id: req.body.id
    });

    res.redirect('/teacher');
})



module.exports = router;