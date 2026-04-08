import { useEffect, useState } from 'react';
import api from './api/axios';
import { UserPlus, ShieldCheck, Users, Mail, UserCog, User, Pencil, Trash2, X } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // State for modal
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth'); // Ensure this matches your route
      setUsers(res.data);
    } catch (error) {
      console.error("Fetch failed", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Actions ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleEditClick = (u) => {
    setEditingUser(u);
    setEditForm({ name: u.name, email: u.email, role: u.role });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/auth/${editingUser.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN": return "bg-rose-100 text-rose-700 border-rose-200";
      case "MANAGER": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    managers: users.filter(u => u.role === 'MANAGER').length,
    staff: users.filter(u => u.role === 'USER').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Users/>} label="Total Users" value={stats.total} color="blue" />
        <StatCard icon={<ShieldCheck/>} label="Admins" value={stats.admins} color="rose" />
        <StatCard icon={<UserCog/>} label="Managers" value={stats.managers} color="amber" />
        <StatCard icon={<User/>} label="Users" value={stats.staff} color="emerald" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#0a2b45]">System Personnel</h3>
          {currentUser.role === 'ADMIN' && (
            <button className="bg-[#0a2b45] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <UserPlus size={18} /> Add User
            </button>
          )}
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold">{u.name}</td>
                <td className="px-6 py-4 text-slate-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getRoleColor(u.role)}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => handleEditClick(u)} className="text-slate-400 hover:text-blue-600">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="text-slate-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Basic Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Edit User</h3>
              <button onClick={() => setEditingUser(null)}><X/></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input 
                className="w-full border p-2 rounded" 
                value={editForm.name} 
                onChange={e => setEditForm({...editForm, name: e.target.value})} 
                placeholder="Name"
              />
              <input 
                className="w-full border p-2 rounded" 
                value={editForm.email} 
                onChange={e => setEditForm({...editForm, email: e.target.value})} 
                placeholder="Email"
              />
              <select 
                className="w-full border p-2 rounded"
                value={editForm.role}
                onChange={e => setEditForm({...editForm, role: e.target.value})}
              >
                <option value="USER">USER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button type="submit" className="w-full bg-[#0a2b45] text-white py-2 rounded">Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center bg-${color}-50 text-${color}-600`}>
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  );
}