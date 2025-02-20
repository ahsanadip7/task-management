import { Outlet } from "react-router-dom";
import TaskBoard from "../TaskBoard";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import Banner from "../TaskBoardComponents/Banner";


const TaskBoardMain = () => {
    const {user} = useContext(AuthContext)
    return (
        <div>
           {user? <> <TaskBoard></TaskBoard></> : <><Banner></Banner><Outlet></Outlet></>}
            
            
        </div>
    );
};

export default TaskBoardMain;