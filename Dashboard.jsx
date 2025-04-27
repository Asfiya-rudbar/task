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
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(error.message);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await updateDoc(taskRef, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">🚀 Your Task Board</h1>
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 transition-transform duration-300 text-white font-bold shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg mb-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Add New Task</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500"
          ></textarea>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl hover:scale-105 transition-transform duration-300"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column Component */}
        {["To Do", "In Progress", "Done"].map((status, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
            <h3
              className={`text-2xl font-bold mb-6 text-center ${
                status === "To Do" ? "text-blue-400" : status === "In Progress" ? "text-yellow-400" : "text-green-400"
              }`}
            >
              {status}
            </h3>
            {tasks.filter((task) => task.status === status).map((task) => (
              <div
                key={task.id}
                className="bg-gray-800 p-5 rounded-xl mb-4 transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                <h4 className="text-white font-bold">{task.title}</h4>
                <p className="text-gray-400 mt-2">{task.description}</p>
                <div className="flex justify-between mt-4 space-x-2">
                  {/* Move Buttons */}
                  {task.status === "To Do" && (
                    <button
                      onClick={() => updateStatus(task.id, "In Progress")}
                      className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all"
                    >
                      Move to In Progress
                    </button>
                  )}
                  {task.status === "In Progress" && (
                    <button
                      onClick={() => updateStatus(task.id, "Done")}
                      className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all"
                    >
                      Move to Done
                    </button>
                  )}
                  {/* Delete button always */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
