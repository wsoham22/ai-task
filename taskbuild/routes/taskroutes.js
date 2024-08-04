const express = require("express");
const router = express.Router();
const taskcontroller = require("./../controller/taskcontroller");

router.post('/createtask', taskcontroller.createTask);
// router.post('/categorize', taskcontroller.categorizeTask);
router.get('/gettask/:id',taskcontroller.gettask);
router.get('/gettasks',taskcontroller.getallTasks);
router.delete('/deletetasks',taskcontroller.deletealltasks);
router.delete('/deletetask/:id',taskcontroller.deletetask);
router.patch('/updatetask/:id',taskcontroller.updatetask);
module.exports = router;
