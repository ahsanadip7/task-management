import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchTasks = () => {
  const [tasks, setTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://job-task-server-g4yrv3pgg-ahsanadip7s-projects.vercel.app/tasks");
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

  useEffect(() => {
    fetchTasks();
  }, []); // This will run once when the component mounts

  return { tasks, loading, refetchTasks: fetchTasks };
};

export default useFetchTasks;
