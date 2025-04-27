import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasksArray = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().userId === auth.currentUser.uid) {
        tasksArray.push({ id: doc.id, ...doc.data() });
      }
    });
    setTasks(tasksArray);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        status: "To Do",
        userId: auth.currentUser.uid,
      });
      alert("Task added successfully!");
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      alert(error.message);
    }
  };

  const deleteTask = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await deleteDoc(taskRef);
      alert("Task Deleted Successfully!");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(error.message);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await updateDoc(taskRef, {
        status: newStatus,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Dashboard - Task Manager</h2>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-10">
        <div className="flex flex-col mb-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-gray-700 bg-gray-800 text-white p-3 rounded-xl mb-4"
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border border-gray-700 bg-gray-800 text-white p-3 rounded-xl mb-4"
          ></textarea>
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* To Do */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-blue-400">To Do</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">+</button>
          </div>
          {tasks.filter(task => task.status === "To Do").map(task => (
            <div key={task.id} className="bg-gray-800 p-4 rounded-xl mb-4">
              <h4 className="text-white font-semibold">{task.title}</h4>
              <p className="text-gray-400 mt-2">{task.description}</p>
              <div className="flex mt-4 space-x-2">
                <button 
                  onClick={() => updateStatus(task.id, "In Progress")} 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg"
                >
                  In Progress
                </button>
                <button 
                  onClick={() => deleteTask(task.id)} 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* In Progress */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-yellow-400">In Progress</h3>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full">+</button>
          </div>
          {tasks.filter(task => task.status === "In Progress").map(task => (
            <div key={task.id} className="bg-gray-800 p-4 rounded-xl mb-4">
              <h4 className="text-white font-semibold">{task.title}</h4>
              <p className="text-gray-400 mt-2">{task.description}</p>
              <div className="flex mt-4 space-x-2">
                <button 
                  onClick={() => updateStatus(task.id, "Done")} 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg"
                >
                  Done
                </button>
                <button 
                  onClick={() => deleteTask(task.id)} 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Done */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-green-400">Done</h3>
            <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full">+</button>
          </div>
          {tasks.filter(task => task.status === "Done").map(task => (
            <div key={task.id} className="bg-gray-800 p-4 rounded-xl mb-4">
              <h4 className="text-white font-semibold">{task.title}</h4>
              <p className="text-gray-400 mt-2">{task.description}</p>
              <div className="flex mt-4">
                <button 
                  onClick={() => deleteTask(task.id)} 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
