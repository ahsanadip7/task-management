import { useState, useEffect } from 'react';
import axios from 'axios';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskItem from './TaskItem'; // Import TaskItem

const TaskManagement = () => {
    const [tasks, setTasks] = useState({
        'To-Do': [],
        'In Progress': [],
        'Done': [],
    });
    const [newTask, setNewTask] = useState({ title: '', description: '', category: 'To-Do' });
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);  // New state for loading

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);  // Start loading
            try {
                const response = await axios.get('http://localhost:5000/tasks');
                const fetchedTasks = response.data;

                setTasks({
                    'To-Do': fetchedTasks.filter(task => task.category === 'To-Do'),
                    'In Progress': fetchedTasks.filter(task => task.category === 'In Progress'),
                    'Done': fetchedTasks.filter(task => task.category === 'Done'),
                });
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);  // Stop loading
            }
        };

        fetchTasks();
    }, []);

    const handleAddOrEditTask = async () => {
        setLoading(true);  // Start loading
        if (editingTask) {
            try {
                await axios.put(`http://localhost:5000/tasks/${editingTask._id}`, newTask);
    
                // Update the task directly in state to immediately reflect the changes
                setTasks(prev => {
                    // Remove task from old category
                    const updatedTasks = { ...prev };
                    updatedTasks[editingTask.category] = updatedTasks[editingTask.category].filter(task => task._id !== editingTask._id);
    
                    // Add task to the new category (if category has changed)
                    if (newTask.category !== editingTask.category) {
                        updatedTasks[newTask.category] = [...updatedTasks[newTask.category], { ...newTask, _id: editingTask._id }];
                    } else {
                        updatedTasks[editingTask.category] = [...updatedTasks[editingTask.category], { ...newTask, _id: editingTask._id }];
                    }
    
                    return updatedTasks;
                });
            } catch (error) {
                console.error('Error updating task:', error);
            }
        } else {
            try {
                const response = await axios.post('http://localhost:5000/tasks', newTask);
                const addedTask = response.data;
    
                // Add the new task directly to state to immediately reflect it
                setTasks(prev => ({
                    ...prev,
                    [addedTask.category]: [...prev[addedTask.category], addedTask],
                }));
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    
        setNewTask({ title: '', description: '', category: 'To-Do' });
        setEditingTask(null);
        setShowForm(false);
        setLoading(false);  // Stop loading
    };
    
    const handleDeleteTask = async (id, category) => {
        setLoading(true);  // Start loading
        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`);

            // Remove task directly from state
            setTasks(prev => ({
                ...prev,
                [category]: prev[category].filter(task => task._id !== id),
            }));
        } catch (error) {
            console.error('Error deleting task:', error);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const fromCategory = active.data.current.sortable.containerId;
            const toCategory = over.data.current.sortable.containerId;

            const updatedTasks = { ...tasks };
            const fromIndex = updatedTasks[fromCategory].findIndex(task => task._id === active.id);
            const taskToMove = updatedTasks[fromCategory][fromIndex];

            // Remove task from the original category
            updatedTasks[fromCategory] = updatedTasks[fromCategory].filter(task => task._id !== active.id);

            // Add task to the new category
            updatedTasks[toCategory] = [...updatedTasks[toCategory], taskToMove];

            // Update task's category in the state
            taskToMove.category = toCategory;

            setTasks(updatedTasks);

            // Optionally, update the backend
            axios.put(`http://localhost:5000/tasks/${taskToMove._id}`, taskToMove)
                .then(() => console.log('Task updated successfully'))
                .catch(error => console.error('Error updating task in database:', error));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-semibold mb-8 text-center text-blue-600">Task Management</h1>
            <div className="text-center mb-4">
                <button
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
                    onClick={() => setShowForm(true)}
                >
                    Add Task
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 mx-auto">
                    <h3 className="text-xl font-semibold mb-4">{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Task Title"
                        maxLength="50"
                        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                        value={newTask.description}
                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Task Description"
                        maxLength="200"
                        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={newTask.category}
                        onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="To-Do">To-Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    <button
                        onClick={handleAddOrEditTask}
                        className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
                    >
                        {editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center mt-8">
                    <div className="loader"></div> {/* Replace with your loader component or animation */}
                </div>
            ) : (
                <DndContext onDragEnd={handleDragEnd}>
                    <div className="flex gap-8 justify-between mt-8">
                        {['To-Do', 'In Progress', 'Done'].map(category => (
                            <div key={category} className="w-1/3">
                                <h2 className="text-2xl font-semibold text-blue-600 mb-4">{category}</h2>
                                <SortableContext items={tasks[category]} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-4">
                                        {tasks[category]?.map(task => (
                                            <TaskItem
                                                key={task._id}
                                                task={task}
                                                handleDeleteTask={handleDeleteTask}
                                                setNewTask={setNewTask}
                                                setEditingTask={setEditingTask}
                                                setShowForm={setShowForm}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </div>
                        ))}
                    </div>
                </DndContext>
            )}
        </div>
    );
};

export default TaskManagement;
