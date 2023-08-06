var express = require('express');
var router = express.Router();
var subjectDB = require('../db/subject')

router.get('/', async function (req, res) { // req = request, res = response
    var subject_db = new subjectDB.Subject();

    var subjects = await subject_db.filter({});
    res.render('subject/list', {
        title: "Materias", 
        subjects: subjects       
    });

})


router.get('/new/', async function (req, res) { // req = request, res = response
    
    
    res.render('subject/new', {
        title: "Nueva Materia"       
    });

})

router.post('/new', async function (req, res) {


    var subject_db = new subjectDB.Subject();
    await subject_db.create({        
        name: req.body.name,
        credits: req.body.credits,
        description: req.body.description       
    });

    res.redirect('/subject');
})

router.get('/update/:id', async function (req, res) { // req = request, res = response
    var subject_db = new subjectDB.Subject();

    
    var subject = await subject_db.single({ id: req.params.id });

    res.render('subject/update', {
        title: "Update Materia",
        subject: subject       
    });

})

router.post('/update', async function (req, res) {


    if(!req.body.id){
        res.redirect('/subject');
        return;    
    }
    
    var subject_db = new subjectDB.Subject();

    await subject_db.update({        
        name: req.body.name,
        credits: req.body.credits,
        description: req.body.description
    }, {
        id: req.body.id
    });

    res.redirect('/subject');
})



module.exports = router;