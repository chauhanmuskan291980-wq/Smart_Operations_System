import { useEffect, useState } from "react";
import api from "./api/axios";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  User,
  LayoutDashboard,
  ListTodo,
  X,
  Clock,
  Pencil,
} from "lucide-react";

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing an existing task
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedToId: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

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

  useEffect(() => {
    fetchTasks();
  }, []);

  // Open modal for creating a NEW task
  const handleOpenCreate = () => {
    setForm({ title: "", description: "", assignedToId: "" });
    setEditingId(null);
    setOpen(true);
  };

  // Open modal for EDITING an existing task
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
      if (editingId) {
        // Update existing task
        await api.put(`/tasks/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new task
        await api.post("/tasks", form, {
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

  const toggle = async (id, currentStatus) => {
    let nextStatus;

    // Define the workflow: OPEN -> IN_PROGRESS -> COMPLETED -> (Back to) OPEN
    if (currentStatus === "OPEN") {
      nextStatus = "IN_PROGRESS";
    } else if (currentStatus === "IN_PROGRESS") {
      nextStatus = "COMPLETED";
    } else {
      nextStatus = "OPEN"; // Resets the task if clicked when COMPLETED
    }

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/tasks/${id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      fetchTasks();
    } catch (error) {
      console.error("Database sync failed:", error.response?.data);
      alert(
        "Check your backend: Ensure the 'patch' route exists and the enum matches.",
      );
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-amber-100 text-amber-700"; // For OPEN
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "ALL") return true;
    return t.status === filter;
  });

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
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a2b45]/5 text-[#0a2b45] rounded-xl font-semibold transition-colors">
              <ListTodo size={20} /> Tasks
            </button>
          </nav>
        </div>

        <div className="mt-10 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0a2b45] text-white flex items-center justify-center font-bold">
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

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Tasks
            </h2>
            <p className="text-slate-500 mt-1">
              Manage, track, and organize your team's workflow.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-[#0a2b45] text-white px-5 py-2.5 rounded-xl hover:bg-[#082236] transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Plus size={20} /> New Task
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          {["ALL", "OPEN", "IN_PROGRESS", "COMPLETED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-[#0a2b45] text-white"
                  : "bg-white text-slate-600 border"
              }`}
            >
              {f === "ALL" ? "All" : f.replace("_", " ")}
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
            <p className="text-slate-400">
              Try adjusting your filters or create a new task.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col"
              >
                {/* Top Accent Line */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${task.status === "COMPLETED" ? "bg-emerald-500" : "bg-[#0a2b45]"}`}
                ></div>

                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-slate-800 pr-4 leading-tight">
                    {task.title}
                  </h3>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(task)}
                        className="text-slate-400 hover:text-[#0a2b45] transition-colors p-1.5 bg-slate-50 hover:bg-slate-100 rounded-md"
                        title="Edit Task"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1.5 bg-slate-50 hover:bg-red-50 rounded-md"
                        title="Delete Task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {task.description || "No description provided."}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                    <User size={16} className="text-[#0a2b45]" />
                    {isAdmin ? task.assignedTo?.name || "Unassigned" : "Me"}
                  </div>

                  {/* Replace the button inside your .map() with this */}
                  <button
                    onClick={() => toggle(task.id, task.status)}
                    className={`text-xs px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95 ${
                      task.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : task.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-sm shadow-blue-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    }`}
                  >
                    {task.status === "COMPLETED" && <CheckCircle2 size={16} />}
                    {task.status === "IN_PROGRESS" && (
                      <Clock size={16} className="animate-pulse" />
                    )}
                    {task.status === "OPEN" && <Circle size={16} />}

                    {/* Display the text properly */}
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

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {editingId ? "Edit Task" : "Create New Task"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Task Title
                </label>
                <input
                  required
                  value={form.title}
                  placeholder="e.g., Update Landing Page"
                  className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0a2b45] focus:border-[#0a2b45] outline-none transition-all placeholder:text-slate-400"
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows="4"
                  value={form.description}
                  placeholder="Provide detailed instructions..."
                  className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0a2b45] focus:border-[#0a2b45] outline-none transition-all resize-none placeholder:text-slate-400"
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Assign To (User ID)
                </label>
                <input
                  value={form.assignedToId}
                  placeholder="Enter User ID"
                  className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0a2b45] focus:border-[#0a2b45] outline-none transition-all placeholder:text-slate-400"
                  onChange={(e) =>
                    setForm({ ...form, assignedToId: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0a2b45] text-white font-semibold px-4 py-3 rounded-xl hover:bg-[#082236] transition-colors shadow-md"
                >
                  {editingId ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
