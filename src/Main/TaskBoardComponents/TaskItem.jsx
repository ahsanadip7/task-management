import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const TaskItem = ({ task, index, handleDeleteTask, setNewTask, setEditingTask, setShowForm }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
    data: { category: task.category, index },
  });

  const handleEdit = () => {
    console.log('edit btn clicked');
    setShowForm(true);
    setNewTask({
         title: task.title,
         description: task.description, 
         category: task.category, 
        });
    setEditingTask(task);
  };


  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className="p-4 bg-gray-200 rounded-lg shadow-md mb-2"
    >
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm">{task.description}</p>
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

// Define PropTypes
TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  handleDeleteTask: PropTypes.func.isRequired,
  setNewTask: PropTypes.func.isRequired,
  setEditingTask: PropTypes.func.isRequired,
  setShowForm: PropTypes.func.isRequired,
};
