import { useState, useEffect } from 'react';
import { FaPlus, FaEllipsisV, FaSearch, FaGripLines, FaCheck } from 'react-icons/fa';
import { auth, db } from '../config/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import task from '../assets/task.png';
import list from "../assets/list.png";
import board from "../assets/board.png";
import logout from '../assets/logout.png';
import '../App.css';

function TaskListView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });

  const [viewMode, setViewMode] = useState("list"); // 'list' or 'board'
  

  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    status: 'todo',
    category: 'work',
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all'); // Filter by category
  const [searchQuery, setSearchQuery] = useState(''); // Search by task title
  const [showMenu, setShowMenu] = useState(null); // Track which task's menu is open

  // Fetch user data on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
        setUser({
          name: user.displayName,
          profilePic: user.photoURL,
        });
      } else {
        console.log('No user is signed in.');
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        console.log('Fetched tasks:', querySnapshot.docs);
        const tasksData = { todo: [], inProgress: [], completed: [] };

        querySnapshot.forEach((doc) => {
          const task = { id: doc.id, ...doc.data() };
          tasksData[task.status].push(task);
        });

        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks: ', error);
      }
    };

    fetchTasks();
  }, []);

  // Open Add Task Modal
  const openModal = () => {
    setEditTaskId(null); // Reset edit task ID
    setNewTask({ title: '', dueDate: '', status: 'todo', category: 'work' });
    setIsModalOpen(true);
  };

  // Close Add Task Modal
  const closeModal = () => setIsModalOpen(false);

  // Add or Update Task
  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editTaskId) {
        // Update existing task
        await updateDoc(doc(db, 'tasks', editTaskId), newTask);
        setTasks((prevTasks) => ({
          ...prevTasks,
          [newTask.status]: prevTasks[newTask.status].map((task) =>
            task.id === editTaskId ? { ...task, ...newTask } : task
          ),
        }));
      } else {
        // Add new task
        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        setTasks((prevTasks) => ({
          ...prevTasks,
          [newTask.status]: [
            ...prevTasks[newTask.status],
            { id: docRef.id, ...newTask },
          ],
        }));
      }

      closeModal();
    } catch (error) {
      console.error('Error saving task: ', error);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId, status) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks((prevTasks) => ({
        ...prevTasks,
        [status]: prevTasks[status].filter((task) => task.id !== taskId),
      }));
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('name');
      localStorage.removeItem('profilePic');
      window.location.href = '/'; // Redirect to home page
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

const onDragEnd = (result) => {
  const { source, destination } = result;

  if (!destination) return;

  if (source.droppableId === destination.droppableId && source.index === destination.index) return;

  const sourceTasks = [...tasks[source.droppableId]]; // Ensure source.droppableId matches the droppableId
  const destinationTasks = [...tasks[destination.droppableId]]; // Ensure destination.droppableId matches the droppableId
  const [removed] = sourceTasks.splice(source.index, 1);

  if (source.droppableId !== destination.droppableId) {
    removed.status = destination.droppableId;
  }

  destinationTasks.splice(destination.index, 0, removed);

  updateDoc(doc(db, "tasks", removed.id), { status: removed.status });

  setTasks({
    ...tasks,
    [source.droppableId]: sourceTasks,
    [destination.droppableId]: destinationTasks,
  });
};

  // Filter tasks by category and search query
  const filteredTasks = (tasksList) => {
    return tasksList.filter((task) => {
      const matchesCategory =
        filterCategory === 'all' ||
        task.category.toLowerCase() === filterCategory.toLowerCase();
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };
  const [selectedTasks, setSelectedTasks] = useState([]); // Track selected task IDs

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white p-4 mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={task} alt="TaskBuddy" className="w-10 h-10 mr-2" />
            <h1 className="text-2xl font-bold text-fuchsia-500">TaskBuddy</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <img
                  src={user.profilePic || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <h2 className="text-gray-900 hidden md:block">{user.name}</h2>
              </>
            )}
          </div>
        </div>
        <div className="container lg:mx-auto flex justify-between items-center mt-4">
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => setViewMode("list")}
              className="text-gray-700 hover:underline mr-4 flex text-2xl items-center"
            >
              <img src={list} alt="" className="w-6 h-6 mt-1" />
              List
            </button>
            <button
              onClick={() => setViewMode("board")}
              className="text-gray-700 hover:underline text-2xl flex items-center"
            >
              <img src={board} alt="" className="w-6 h-6" />
              Board
            </button>
          </div><div className=""></div>
          <button onClick={handleLogout} className="text-gray-700 flex border-2 rounded-2xl p-2 hover:border-gray-700 border-gray-500 cursor-pointer">
            <img src={logout} alt="" className="w-6 h-6" />
            Logout
          </button>
        </div>
      </header>

      {/* Filter and Search */}
      <div className="container mx-auto mb-6 ">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <p className="text-gray-700 text-2xl font-semibold mr-2">
                Filter By:
              </p>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="p-2 border border-gray-400 rounded-2xl"
              >
                <option value="all">All</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-gray-500" />
              <select className="p-2 border border-gray-400 rounded-2xl">
                <option>Due Date</option>
                <option>Today</option>
                <option>Tomorrow</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by task title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
        </div>
      </div>
      

      {/* Task Sections with Drag-and-Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={`container mx-auto grid gap-6 ${
          viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
        }`}>
          {Object.entries(tasks).map(([status, tasksList]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-fuchsia-500">
                      {status === 'todo' && 'To-Do'}
                      {status === 'inProgress' && 'In-Progress'}
                      {status === 'completed' && 'Completed'} (
                      {filteredTasks(tasksList).length})
                    </h2>
                    {status === 'todo' && (
                      <button
                        onClick={openModal}
                        className="bg-fuchsia-500 text-white p-2 rounded flex items-center"
                      >
                        <FaPlus className="mr-2" />
                        Add Task
                      </button>
                    )}
                  </div>
                  {filteredTasks(tasksList).length === 0 ? (
                    <p className="text-gray-500">No Tasks</p>
                  ) : (
                    filteredTasks(tasksList).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-gray-50 p-3 rounded mb-2 flex items-center space-x-4"
                          >
                            {/* Checkbox for Selection */}
                            <input
                              type="checkbox"
                              checked={selectedTasks.includes(task.id)}
                              onChange={() => {
                                if (selectedTasks.includes(task.id)) {
                                  setSelectedTasks(selectedTasks.filter((id) => id !== task.id));
                                } else {
                                  setSelectedTasks([...selectedTasks, task.id]);
                                }
                              }}
                              className="mr-3 w-4 h-4"
                            />
                               {/* Tick Icon */}
                               <FaCheck
                              className={`${
                                status === "completed" ? "text-green-500" : "text-gray-500"
                              }`}
                            />

                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-move"
                            >
                              <FaGripLines className="text-gray-500" />
                            </div>

                            {/* Task Details */}
                            <div className="flex-1 grid grid-cols-4 gap-4">
                              {status === 'completed' ? (
                                <del className="font-bold">{task.title}</del>
                              ) : (
                                <p className="font-bold">{task.title}</p>
                              )}
                              <p className="text-sm text-gray-500 hidden lg:block">
                                {task.dueDate}
                              </p>
                              <p className="text-sm text-gray-500 hidden lg:block">
                                {task.status}
                              </p>
                              <p className="text-sm text-gray-500 hidden lg:block">
                                {task.category}
                              </p>
                            </div>

                            {/* Three Dots Menu */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setShowMenu(
                                    showMenu === task.id ? null : task.id
                                  )
                                }
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <FaEllipsisV />
                              </button>
                              {/* Dropdown Menu for Edit and Delete */}
                              {showMenu === task.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                  <button
                                    onClick={() => {
                                      setNewTask(task);
                                      setEditTaskId(task.id);
                                      setIsModalOpen(true);
                                      setShowMenu(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteTask(task.id, task.status);
                                      setShowMenu(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

          {/* Footer for Selected Tasks */}
          {selectedTasks.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <p className="text-gray-700">
              {selectedTasks.length} task{selectedTasks.length > 1 ? "s" : ""} selected
            </p>
            <select
              onChange={(e) => {
                const newStatus = e.target.value;
                selectedTasks.forEach((taskId) => {
                  updateDoc(doc(db, "tasks", taskId), { status: newStatus });
                });
                setSelectedTasks([]);
              }}
              className="p-2 border border-gray-400 rounded"
            >
              <option value="todo">To-Do</option>
              <option value="inProgress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={() => {
                selectedTasks.forEach((taskId) => {
                  const task = tasks.todo
                    .concat(tasks.inProgress)
                    .concat(tasks.completed)
                    .find((t) => t.id === taskId);
                  if (task) {
                    handleDeleteTask(taskId, task.status);
                  }
                });
                setSelectedTasks([]);
              }}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete Selected
            </button>
          </div>
          <button
            onClick={() => setSelectedTasks([])}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Add/Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editTaskId ? 'Edit Task' : 'Add Task'}
            </h2>
            <form onSubmit={handleTaskSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                >
                  <option value="todo">To-Do</option>
                  <option value="inProgress">In-Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-fuchsia-500 text-white p-2 rounded"
                >
                  {editTaskId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskListView;