import { useState, useEffect } from "react";
import axios from "axios";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskItem } from "./TaskItem";

const TaskManagement = () => {
    const [tasks, setTasks] = useState({
        "To-Do": [],
        "In Progress": [],
        Done: [],
    });
    const [newTask, setNewTask] = useState({ title: "", description: "", category: "To-Do" });
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch tasks from the backend
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/tasks');
                const fetchedTasks = response.data;

                setTasks({
                    "To-Do": fetchedTasks.filter(task => task.category === "To-Do"),
                    "In Progress": fetchedTasks.filter(task => task.category === "In Progress"),
                    "Done": fetchedTasks.filter(task => task.category === "Done"),
                });
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Add or Edit task
    const handleAddOrEditTask = async () => {
        console.log("handleAddOrEditTask called"); // Debugging

        setLoading(true);  // Start loading
        try {
            if (editingTask) {
                console.log("Editing task:", editingTask); // Debugging
                await axios.put(`http://localhost:5000/tasks/${editingTask._id}`, newTask);
                setTasks((prev) => {
                    const updatedTasks = { ...prev };
                    updatedTasks[editingTask.category] = updatedTasks[editingTask.category].filter(task => task._id !== editingTask._id);

                    updatedTasks[newTask.category] = [...updatedTasks[newTask.category], { ...newTask, _id: editingTask._id }];
                    return updatedTasks;
                });
            } else {
                console.log("Adding new task:", newTask); // Debugging
                const response = await axios.post('http://localhost:5000/tasks', newTask);
                const addedTask = response.data;
                setTasks((prev) => ({
                    ...prev,
                    [addedTask.category]: [...prev[addedTask.category], addedTask],
                }));
            }
            setNewTask({ title: "", description: "", category: "To-Do" });
            setEditingTask(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error adding/editing task:", error);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    useEffect(() => {
        if (editingTask && !showForm) {
            setShowForm(true);
        }
    }, [editingTask, showForm]); // Include showForm in the dependency array
    
    
    

    // Handle drag end (reordering tasks between categories)
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
    
        const sourceCategory = active.data.current.category;
        const destinationCategory = over.data.current.category;
    
        if (sourceCategory === destinationCategory) {
            setTasks((prev) => ({
                ...prev,
                [sourceCategory]: arrayMove(prev[sourceCategory], active.data.current.index, over.data.current.index),
            }));
        } else {
            const sourceTasks = [...tasks[sourceCategory]];
            const destinationTasks = [...tasks[destinationCategory]];
    
            const [movedTask] = sourceTasks.splice(active.data.current.index, 1);
            movedTask.category = destinationCategory;
            destinationTasks.splice(over.data.current.index, 0, movedTask);
    
            setTasks((prev) => ({
                ...prev,
                [sourceCategory]: sourceTasks,
                [destinationCategory]: destinationTasks,
            }));
    
            // Use PATCH request to update only the category of the moved task
            axios.patch(`http://localhost:5000/tasks/${movedTask._id}`, { category: destinationCategory })
                .then(() => {
                    console.log("Task category updated");
                })
                .catch((error) => {
                    console.error("Error updating task category:", error);
                });
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-semibold mb-8 text-center text-blue-600">Task Management</h1>

        <div className="text-center mb-4">
        <button
    className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
    onClick={() => {
        if (!showForm && !loading) {
            setShowForm(true);
        }
    }}
    disabled={loading} // Disable button if loading
>
    Add Task
</button>

        </div>

        {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 mx-auto">
                <h3 className="text-xl font-semibold mb-4">{editingTask ? "Edit Task" : "Add New Task"}</h3>
                <input
    type="text"
    value={newTask.title || ""}  // Ensure value is not null
    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
    placeholder="Task Title"
    maxLength="50"
    className="w-full p-3 border rounded-lg mb-4"
/>
<textarea
    value={newTask.description || ""}  // Ensure value is not null
    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
    placeholder="Task Description"
    maxLength="200"
    className="w-full p-3 border rounded-lg mb-4"
/>
<select
    value={newTask.category || "To-Do"}  // Ensure value is not null, default to "To-Do"
    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
    className="w-full p-3 border rounded-lg mb-4"
>
    <option value="To-Do">To-Do</option>
    <option value="In Progress">In Progress</option>
    <option value="Done">Done</option>
</select>

                <button
                    onClick={handleAddOrEditTask}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
                    disabled={loading}  // Disable button if loading
                >
                    {editingTask ? "Update Task" : "Add Task"}
                </button>
            </div>
        )}

        {loading ? (
            <div className="text-center mt-8">Loading...</div>
        ) : (
                <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                    <div className="flex gap-8 justify-between mt-8">
                        {Object.keys(tasks).map((category) => (
                            <SortableContext key={category} items={tasks[category]} strategy={verticalListSortingStrategy}>
                                <div className="w-1/3 p-4 bg-white shadow-lg rounded-lg">
                                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">{category}</h2>
                                    {tasks[category].map((task, index) => (
                                        <TaskItem
                                            key={task._id}
                                            task={task}
                                            index={index}
                                            
                                            setNewTask={setNewTask}  
                                            setEditingTask={setEditingTask}
                                            setShowForm={setShowForm}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        ))}
                    </div>
                </DndContext>
            )}
        </div>
    );
};

export default TaskManagement;

