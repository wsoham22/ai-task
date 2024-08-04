const axios = require("axios")
const Task = require("./models/taskmodel");

exports.createTask = async (req, res, next) => {
    try {
        const { date, task } = req.body;

        // Send task data to prediction endpoint
        const response = await axios.post('http://localhost:6000/api/predict', { task });
        const category = response.data.prediction[0];

        // Create new task with category
        const newTask = new Task({
            date: date,
            task: task,
            category: category // Add category to task data
        });

        const savedTask = await newTask.save();

        res.status(201).json({ message: "Task created successfully", task: savedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.gettask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const getTask = await Task.findById(id);

        if (!getTask) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found with this ID!'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                task: getTask
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

exports.getallTasks = async(req,res,next) =>{
    try {
        const tasks = await Task.find();

        res.status(200).json({
            tasks: tasks
        });
    }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error getting all tasks' });
        }
    }
exports.deletetask = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found with this ID!'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                task: {
                    _id: deletedTask._id,
                    date: deletedTask.date,
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

exports.updatetask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const { task } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { task: task },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found with this ID!'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                task: updatedTask
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

exports.deletealltasks = async(req,res,next) =>{
    try{
        await Task.deleteMany();
        res.status(200).json({
            status:'success',
            data:'null'
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error deleting all tasks' });
    }
}

exports.deleteTasksForDate = async (req, res, next) => {
    try {
      const { date } = req.params;
      const parsedDate = new Date(date);
      await Task.deleteMany({ date: parsedDate });
      res.status(200).json({ message: 'Tasks deleted successfully for the specified date.' });
    } catch (error) {
      console.error('Error deleting tasks for date:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};
