import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Filter,
  Calendar,
  Clock,
  User,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, completed, pending
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Calculate statistics
  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    setStats({ total, completed, pending });
  }, [tasks]);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTasks();
  }, []);

  const handleSave = async () => {
    if (!title.trim()) return;

    setTaskLoading(true);
    try {
      if (editingId) {
        await API.put(`/tasks/${editingId}`, { title });
        setEditingId(null);
      } else {
        await API.post("/tasks", { title });
      }
      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setTaskLoading(false);
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setEditingId(task._id);
    // Scroll to input
    document.getElementById("task-input")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, { 
        ...task, 
        completed: !task.completed 
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCancelEdit = () => {
    setTitle("");
    setEditingId(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const filteredTasks = tasks
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Only show on mobile when menu is open */}
        {showMobileMenu && (
          <>
            {/* Overlay for mobile menu */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
            {/* Sidebar for mobile */}
            <div className="
              fixed inset-y-0 left-0 z-40 w-64 
              transform transition-transform duration-300 ease-in-out
              translate-x-0 lg:hidden
            ">
              <Sidebar user={user} onLogout={logout} />
            </div>
          </>
        )}

        {/* Desktop - Sidebar is permanently hidden */}
        {/* Mobile aur Desktop dono ke liye sidebar hidden hai, sirf mobile menu toggle se show hota hai */}

        <div className="flex-1 flex flex-col min-h-screen w-full">
          {/* Navbar - Desktop mein show karein */}
          <div className="hidden lg:block">
            <Navbar user={user} onLogout={logout} />
          </div>

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Welcome Section */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your tasks today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Tasks</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Completed</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pending</p>
                    <p className="text-2xl md:text-3xl font-bold text-orange-600">{stats.pending}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Progress</p>
                    <p className="text-2xl md:text-3xl font-bold text-indigo-600">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add/Edit Task Form */}
            <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6 mb-6 md:mb-8" id="task-input">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2 lg:mb-0">
                  {editingId ? 'Edit Task' : 'Add New Task'}
                </h2>
                {editingId && (
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                    disabled={taskLoading}
                  />
                  <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <button
                  onClick={handleSave}
                  disabled={!title.trim() || taskLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {taskLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span className="hidden sm:inline">Processing...</span>
                    </>
                  ) : (
                    <>
                      {editingId ? (
                        <>
                          <Check className="h-5 w-5" />
                          <span>Update Task</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5" />
                          <span>Add Task</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${filter === "all" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${filter === "pending" ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${filter === "completed" ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    My Tasks ({filteredTasks.length})
                  </h3>
                  <button
                    onClick={fetchTasks}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="p-8 md:p-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-3 text-gray-600">Loading tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No tasks found</h4>
                  <p className="text-gray-500 mb-4">
                    {search ? 'Try a different search term' : 'Start by adding your first task'}
                  </p>
                  {!search && (
                    <button
                      onClick={() => document.getElementById("task-input")?.scrollIntoView({ behavior: "smooth" })}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add your first task
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredTasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <button
                            onClick={() => toggleTaskStatus(task)}
                            className={`h-6 w-6 rounded-full border-2 flex-shrink-0 mt-1 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'}`}
                          >
                            {task.completed && <Check className="h-4 w-4 text-white mx-auto" />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                              <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {task.title}
                              </h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${task.completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'} mt-1 sm:mt-0`}>
                                {task.completed ? 'Completed' : 'Pending'}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4 mt-2">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(task.createdAt)}
                              </span>
                              {task.updatedAt !== task.createdAt && (
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Updated {formatDate(task.updatedAt)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(task)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit task"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats at Bottom */}
            <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Today's Progress</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% Complete
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Completion</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.completed} tasks done
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Your Activity</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {tasks.length} total tasks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}