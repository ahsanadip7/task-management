import { useState, useEffect } from "react";
import axios from "axios";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskItem from "./TaskItem";

const TaskManagement = () => {
  const [tasks, setTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "To-Do",
  });
  const [editingTask, setEditingTask] = useState(null); // State for editing a task

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/tasks");
        const fetchedTasks = response.data;

        setTasks({
          "To-Do": fetchedTasks.filter((task) => task.category === "To-Do"),
          "In Progress": fetchedTasks.filter((task) => task.category === "In Progress"),
          Done: fetchedTasks.filter((task) => task.category === "Done"),
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceCategory = active.data.current.category;
    const destinationCategory = over.data.current.category;

    if (sourceCategory === destinationCategory) {
      const newOrderedTasks = arrayMove(
        tasks[sourceCategory],
        active.data.current.index,
        over.data.current.index
      );
      setTasks((prev) => ({
        ...prev,
        [sourceCategory]: newOrderedTasks,
      }));

      axios.patch(`http://localhost:5000/tasks/order`, {
        category: sourceCategory,
        tasks: newOrderedTasks.map((task) => task._id),
      });
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

      axios.patch(`http://localhost:5000/tasks/move`, {
        taskId: movedTask._id,
        category: destinationCategory,
        tasks: destinationTasks.map((task) => task._id),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const { title, description, category } = newTask;
    if (!title || !description) {
      alert("Title and description are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/tasks", {
        title,
        description,
        category,
      });

      setTasks((prevTasks) => ({
        ...prevTasks,
        [category]: [...prevTasks[category], response.data],
      }));

      setNewTask({ title: "", description: "", category: "To-Do" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        Object.keys(updatedTasks).forEach((category) => {
          updatedTasks[category] = updatedTasks[category].filter(
            (task) => task._id !== taskId
          );
        });
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      category: task.category,
    });
  };

 const handleUpdateTask = async (e) => {
  e.preventDefault();
  const { title, description, category } = newTask;
  if (!title || !description) {
    alert("Title and description are required");
    return;
  }

  try {
    const response = await axios.put(`http://localhost:5000/tasks/${editingTask._id}`, {
      title,
      description,
      category,
    });

    // Update UI with updated task
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      Object.keys(updatedTasks).forEach((category) => {
        updatedTasks[category] = updatedTasks[category].map((task) =>
          task._id === editingTask._id ? response.data : task
        );
      });
      return updatedTasks;
    });

    // Clear editing state
    setEditingTask(null);
    setNewTask({ title: "", description: "", category: "To-Do" });
  } catch (error) {
    console.error("Error updating task:", error);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-semibold mb-8 text-center text-blue-600">Task Management</h1>

      {/* Add/Edit Task Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          {editingTask ? "Edit Task" : "Add New Task"}
        </h2>
        <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="flex gap-4 mb-8">
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            placeholder="Task Title"
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="text"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            placeholder="Task Description"
            className="input input-bordered w-full max-w-xs"
          />
          <select
            name="category"
            value={newTask.category}
            onChange={handleInputChange}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button type="submit" className="btn btn-primary">
            {editingTask ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>

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
                      onDelete={handleDeleteTask}
                      onEdit={() => handleEditTask(task)} // Passing onEdit as prop
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
