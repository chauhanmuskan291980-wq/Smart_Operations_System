import { useEffect, useState } from "react";
import api from "./api/axios"; // Adjust path if necessary
import UserManagement from "./UserManagement";
import {
  Plus,
  Trash2,
  CheckCircle2,
  User,
  LayoutDashboard,
  ListTodo,
  X,
  Pencil,
  UserCog,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function TaskDashboard() {
  // --- States ---
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [usersList, setUsersList] = useState([]); // New state for dropdown

  // Set default tab to 'DASHBOARD'
  const [activeTab, setActiveTab] = useState("DASHBOARD");

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedToId: "",
  });

  // --- Auth Context ---
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER";

  // --- Data Fetching ---
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Only keep users with roles "USER" or "MANAGER"
      const assignable = res.data.filter(
        (u) => u.role === "USER" || u.role === "MANAGER",
      );
      setUsersList(assignable);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    if (activeTab === "TASKS" || activeTab === "DASHBOARD") {
      fetchTasks();
    }
    // Also fetch users if the person logged in is an Admin or Manager
    if (isAdmin || isManager) {
      fetchUsers();
    }
  }, [activeTab]);

  // --- Handlers ---
  const handleOpenCreate = () => {
    setForm({ title: "", description: "", assignedToId: "" });
    setEditingId(null);
    setOpen(true);
  };

  const handleOpenEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      assignedToId: task.assignedToId || task.assignedTo?.id || "",
    });
    setEditingId(task.id);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await api.put(`/tasks/${editingId}`, form, config,{
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/tasks", form, config,{
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setOpen(false);
      setForm({ title: "", description: "", assignedToId: "" });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error("Failed to save task", error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    let nextStatus;
    if (currentStatus === "OPEN") nextStatus = "IN_PROGRESS";
    else if (currentStatus === "IN_PROGRESS") nextStatus = "COMPLETED";
    else nextStatus = "OPEN";

    try {
      await api.patch(
        `/tasks/${id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchTasks();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "ALL") return true;
    return t.status === filter;
  });

  // --- Dashboard Calculations ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "OPEN").length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 p-8 hidden md:flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[#0a2b45] flex items-center justify-center">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0a2b45] tracking-tight">
              SMARTOPS
            </h1>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("DASHBOARD")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                activeTab === "DASHBOARD"
                  ? "bg-[#0a2b45]/5 text-[#0a2b45]"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab("TASKS")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                activeTab === "TASKS"
                  ? "bg-[#0a2b45]/5 text-[#0a2b45]"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <ListTodo size={20} /> Tasks
            </button>

            {(isAdmin || isManager) && (
              <button
                onClick={() => setActiveTab("USERS")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  activeTab === "USERS"
                    ? "bg-[#0a2b45]/5 text-[#0a2b45]"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <UserCog size={20} /> User Management
              </button>
            )}
          </nav>
        </div>

        <div className="mt-10 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0a2b45] text-white flex items-center justify-center font-bold uppercase">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="text-sm">
            <p className="text-slate-500 text-xs">Logged in as</p>
            <p className="font-semibold text-slate-800">
              {user?.name || "User"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        {/* --- USERS VIEW --- */}
        {activeTab === "USERS" && <UserManagement />}

        {/* --- DASHBOARD VIEW --- */}
        {activeTab === "DASHBOARD" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Greeting Banner */}
            <div className="bg-[#0a2b45] rounded-3xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name || "User"}! 👋
                </h2>
                <p className="text-slate-300 max-w-lg leading-relaxed">
                  Here is what's happening with your projects today. You have{" "}
                  {pendingTasks} pending tasks that need your attention.
                </p>
                <button
                  onClick={() => setActiveTab("TASKS")}
                  className="mt-6 bg-white text-[#0a2b45] px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-100 transition-colors shadow-sm"
                >
                  View All Tasks
                </button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <ListTodo size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-800">
                    {totalTasks}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    Total Tasks
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-800">
                    {completedTasks}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    Completed
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-800">
                    {inProgressTasks}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    In Progress
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <AlertCircle size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-800">
                    {pendingTasks}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    Pending Review
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Tasks Preview (Optional but looks great) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Recent Tasks
                </h3>
                <button
                  onClick={() => setActiveTab("TASKS")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  See All
                </button>
              </div>
              <div className="space-y-4">
                {tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2 h-10 rounded-full ${
                          task.status === "COMPLETED"
                            ? "bg-emerald-500"
                            : task.status === "IN_PROGRESS"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                        }`}
                      ></div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <User size={12} />{" "}
                          {task.assignedTo?.name || "Me"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                        task.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : task.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {task.status === "OPEN"
                        ? "PENDING"
                        : task.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">
                    No tasks found. Get started by creating one!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TASKS VIEW --- */}
        {activeTab === "TASKS" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Tasks
                </h2>
                <p className="text-slate-500 mt-1">
                  Manage and organize your team's workflow.
                </p>
              </div>

              {(isAdmin) && (
                <button
                  onClick={handleOpenCreate}
                  className="flex items-center gap-2 bg-[#0a2b45] text-white px-5 py-2.5 rounded-xl hover:bg-[#082236] transition-all shadow-md font-medium"
                >
                  <Plus size={20} /> New Task
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {["ALL", "OPEN", "IN_PROGRESS", "COMPLETED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                    filter === f
                      ? "bg-[#0a2b45] text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {f === "ALL" ? "All Tasks" : f.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Task Grid */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <ListTodo size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-600">
                  No tasks found
                </h3>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all relative flex flex-col"
                  >
                    <div
                      className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl ${
                        task.status === "COMPLETED"
                          ? "bg-emerald-500"
                          : task.status === "IN_PROGRESS"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }`}
                    />

                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-slate-800 pr-4">
                        {task.title}
                      </h3>
                      {(isAdmin || isManager) && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(task)}
                            className="text-slate-400 hover:text-[#0a2b45] p-1.5"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-400 hover:text-red-500 p-1.5"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-grow">
                      {task.description || "No description provided."}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <User size={14} />{" "}
                        {task.assignedTo?.name || "Unassigned"}
                      </div>

                      <button
                        onClick={() => toggleStatus(task.id, task.status)}
                        className={`text-xs px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 ${
                          task.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-700"
                            : task.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {task.status === "OPEN"
                          ? "Pending"
                          : task.status.replace("_", " ")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
{/* Task Modal */}
{open && (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
      <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors">
        <X size={20} />
      </button>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">{editingId ? "Edit Task" : "Create Task"}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
          <input required value={form.title} className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0a2b45] outline-none" onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
          <textarea rows="4" value={form.description} className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0a2b45] outline-none resize-none" onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Details..." />
        </div>

        {/* Updated Dropdown Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign To</label>
          <select 
            value={form.assignedToId} 
            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0a2b45] outline-none bg-white"
            onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
          >
            <option value="">Select Team Member</option>
            {usersList.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => setOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold">Cancel</button>
          <button type="submit" className="flex-1 bg-[#0a2b45] text-white rounded-xl font-semibold shadow-md">Save Task</button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}
