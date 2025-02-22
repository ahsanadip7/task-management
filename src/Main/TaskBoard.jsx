
import Footer from "./Footer/Footer";
import Banner from "./TaskBoardComponents/Banner";
import TaskManagement from "./TaskBoardComponents/TaskManagementSystem";

const TaskBoard = () => { // This gets the tasks from the loader

  return (
    <div>
      <Banner />
      <TaskManagement />  {/* Pass tasks as a prop */}
      <Footer></Footer>
    </div>
  );
};

export default TaskBoard;
