
import PropTypes from 'prop-types';

const TaskItem = ({ task, handleDeleteTask, setNewTask, setEditingTask, setShowForm }) => {
    const handleEdit = () => {
        setNewTask({ title: task.title, description: task.description, category: task.category });
        setEditingTask(task);
        setShowForm(true);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={handleEdit}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDeleteTask(task._id, task.category)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

// Add prop-types validation
TaskItem.propTypes = {
    task: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
    }).isRequired,
    handleDeleteTask: PropTypes.func.isRequired,
    setNewTask: PropTypes.func.isRequired,
    setEditingTask: PropTypes.func.isRequired,
    setShowForm: PropTypes.func.isRequired,
};

export default TaskItem;
