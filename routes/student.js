var express = require("express")
const student_controller = require('../controller/student_controller')
var router = express.Router();

router.get('/signin/:email/:pass',student_controller.signinStudent)

router.post('/signup',student_controller.signupStudent)

router.put('/update/:id',student_controller.updateStudent)

router.delete('/delete/:id',student_controller.isloggedin,student_controller.deleteStudent)

router.get('/:rno',student_controller.getname)

router.get('/ideas/:rno',student_controller.getidea)



module.exports =  router;