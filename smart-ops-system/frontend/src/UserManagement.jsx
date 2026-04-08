import { useEffect, useState } from 'react';
import api from './api/axios';
import { UserPlus, ShieldCheck, Users, Mail, UserCog, User, Pencil, Trash2, X } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth',{
        headers: { Authorization: `Bearer ${token}` },
      }); 
      setUsers(res.data);
    } catch (error) {
      console.error("Fetch failed", error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form); // Uses your existing register endpoint
      setIsAddModalOpen(false);
      setForm({ name: '', email: '', password: '', role: 'USER' });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/auth/${editingUser.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingUser(null);
      setForm({ name: '', email: '', password: '', role: 'USER' });
      fetchUsers();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/auth/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Users/>} label="Total Users" value={stats.total} color="blue" />
        <StatCard icon={<ShieldCheck/>} label="Admins" value={stats.admins} color="rose" />
        <StatCard icon={<UserCog/>} label="Managers" value={stats.managers} color="amber" />
        <StatCard icon={<User/>} label="Users" value={stats.staff} color="emerald" />
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#0a2b45]">System Personnel</h3>
          {currentUser.role === 'ADMIN' && (
            <button 
              onClick={() => { setForm({ name: '', email: '', password: '', role: 'USER' }); setIsAddModalOpen(true); }}
              className="bg-[#0a2b45] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
            >
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
                <td className="px-6 py-4 font-semibold text-slate-800">{u.name}</td>
                <td className="px-6 py-4 text-slate-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getRoleColor(u.role)}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => openEdit(u)} className="text-slate-400 hover:text-blue-600"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(u.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add OR Edit */}
      {(isAddModalOpen || editingUser) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => { setIsAddModalOpen(false); setEditingUser(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={24}/>
            </button>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{editingUser ? 'Edit User' : 'Register New User'}</h3>
            
            <form onSubmit={editingUser ? handleUpdate : handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input required className="w-full border border-slate-300 p-2.5 rounded-lg mt-1" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <input required type="email" className="w-full border border-slate-300 p-2.5 rounded-lg mt-1" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">Initial Password</label>
                  <input required type="password" placeholder="••••••••" className="w-full border border-slate-300 p-2.5 rounded-lg mt-1" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">System Role</label>
                <select className="w-full border border-slate-300 p-2.5 rounded-lg mt-1 bg-white" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="USER">USER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              
              <button type="submit" className="w-full bg-[#0a2b45] text-white py-3 rounded-lg font-bold shadow-lg hover:bg-[#071d2e] transition-all">
                {editingUser ? 'Save Changes' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center ${colorMap[color]}`}>{icon}</div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  );
}