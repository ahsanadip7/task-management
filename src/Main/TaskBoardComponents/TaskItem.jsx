import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Swal from 'sweetalert2';

const TaskItem = ({ task, index, onDelete, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: task._id,
      data: { category: task.category, index },
    });
  
    const handleDelete = () => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          onDelete(task._id); // Trigger delete action passed from parent (TaskManagement)
          Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
        }
      });
    };
  
    const handleEdit = () => {
      onEdit(task); // Trigger edit action passed from parent (TaskManagement)
    };
  
    return (
      <div className="mb-3 bg-base-300 p-3 rounded-xl">
        <div
          ref={setNodeRef}
          style={{
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
            backgroundColor: isDragging ? '#f0f0f0' : 'inherit',
          }}
          {...attributes}
          {...listeners}
          className="relative p-4 rounded-lg hover:bg-gray-300 transition"
        >
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm">{task.description}</p>
        </div>
  
        <div className=" p-2 relative flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            className="btn text-white bg-yellow-500 px-4 py-1 rounded-lg mr-2 hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="btn text-white bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
    
      </div>
    );
  };
  

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default TaskItem;
