import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import "./dashboard.css"; // Make sure this path is correct

// Base URL for your API
const API_URL = 'http://localhost:5000/api'; 

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ date: '', task: [] });
    const [taskId, setTaskId] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/gettasks`);
            setTasks(response.data.tasks);
        } catch (err) {
            setError('Error fetching tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/createtask`, task);
            fetchTasks(); // Refresh tasks list
            setTask({ date: '', task: [] });
            toast.success('Task created successfully!');
        } catch (err) {
            toast.error('Error creating task');
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${API_URL}/updatetask/${taskId}`, { task: task.task });
            fetchTasks(); // Refresh tasks list
            setTask({ date: '', task: [] });
            setTaskId('');
            setEditingTask(null);
            toast.success('Task updated successfully!');
        } catch (err) {
            toast.error('Error updating task');
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this task?')) {
                await axios.delete(`${API_URL}/deletetask/${id}`);
                fetchTasks(); // Refresh tasks list
                toast.success('Task deleted successfully!');
            }
        } catch (err) {
            toast.error('Error deleting task');
        }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setTask({
            date: task.date,
            task: task.task.join(',')
        });
        setTaskId(task._id);
    };

    return (
        <div className="dashboard-container">
            <ToastContainer />

            <h1>Task Dashboard</h1>

            {/* Create Task Form */}
            <form onSubmit={handleCreateTask} className="form-container">
                <h2>Create Task</h2>
                <input
                    type="date"
                    value={task.date}
                    onChange={(e) => setTask({ ...task, date: e.target.value })}
                    required
                />
                <textarea
                    value={task.task}
                    onChange={(e) => setTask({ ...task, task: e.target.value.split(',') })}
                    placeholder="Enter task here..."
                    required
                />
                <button type="submit">Create Task</button>
            </form>

            {/* Update Task Form */}
            {editingTask && (
                <form onSubmit={handleUpdateTask} className="form-container">
                    <h2>Update Task</h2>
                    <input
                        type="text"
                        value={taskId}
                        onChange={(e) => setTaskId(e.target.value)}
                        placeholder="Enter Task ID"
                        required
                    />
                    <textarea
                        value={task.task}
                        onChange={(e) => setTask({ ...task, task: e.target.value.split(',') })}
                        placeholder="Enter updated tasks separated by commas"
                        required
                    />
                    <button type="submit">Update Task</button>
                </form>
            )}

            {/* Task List */}
            <h2>Task List</h2>
            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                <ul className="task-list">
                    {tasks.map((task) => (
                        <li key={task._id} className="task-item">
                            <div className="task-item-content">
                                <strong>Date:</strong> {new Date(task.date).toLocaleDateString()}<br />
                                <strong>Tasks:</strong> {task.task.join(', ')}<br />
                                <strong>Category:</strong> {task.category.join(', ')}
                            </div>
                            <div className="task-item-buttons">
                                <button onClick={() => handleEditClick(task)} className="icon-button">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDeleteTask(task._id)} className="icon-button">
                                    <FaTrash />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
