import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, Search, Trash2, Shield } from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [search]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await adminService.getUsers({ search });
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(id, role) {
    try {
      const res = await adminService.updateUserRole(id, role);
      if (res.success) {
        showToast(`User role updated to ${role}`, 'success');
        await fetchUsers();
      }
    } catch (err) {
      showToast(err.message || 'Role update failed', 'error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await adminService.deleteUser(id);
      if (res.success) {
        showToast('User deleted', 'info');
        await fetchUsers();
      }
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Manage System Users</h1>
          <p className="text-xs text-slate-400 mt-1">View user accounts, adjust authorization roles, and deactivate accounts.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pl-10 pr-3 py-2.5"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/50 transition">
                <td className="p-3 flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-bold text-white">{u.name}</span>
                </td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white font-bold rounded-lg p-1.5 text-xs"
                  >
                    <option value="USER">USER</option>
                    <option value="GUIDE">GUIDE</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
