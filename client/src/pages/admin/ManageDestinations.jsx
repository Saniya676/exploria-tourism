import React, { useState, useEffect } from 'react';
import { destinationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Compass, Plus, Trash2, Edit3, X } from 'lucide-react';

export default function ManageDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    country_state: '',
    description: '',
    image_url: '',
    best_time: 'October to May',
    estimated_budget: 300,
    popular_activities: 'Trekking, Camping',
    featured: true
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  async function fetchDestinations() {
    try {
      setLoading(true);
      const res = await destinationService.getAll();
      if (res.success) setDestinations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setForm({
      name: '',
      country_state: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000',
      best_time: 'October to May',
      estimated_budget: 350,
      popular_activities: 'Trekking, Camping',
      featured: true
    });
    setModalOpen(true);
  }

  function handleOpenEdit(d) {
    setEditingId(d.id);
    setForm({
      name: d.name,
      country_state: d.country_state,
      description: d.description,
      image_url: d.image_url,
      best_time: d.best_time,
      estimated_budget: d.estimated_budget,
      popular_activities: Array.isArray(d.popular_activities) ? d.popular_activities.join(', ') : d.popular_activities,
      featured: Boolean(d.featured)
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const acts = form.popular_activities.split(',').map(s => s.trim()).filter(Boolean);
      const payload = { ...form, popular_activities: acts };

      if (editingId) {
        await destinationService.update(editingId, payload);
        showToast('Destination updated', 'success');
      } else {
        await destinationService.create(payload);
        showToast('Destination created', 'success');
      }

      setModalOpen(false);
      await fetchDestinations();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this destination?')) return;
    try {
      await destinationService.delete(id);
      showToast('Destination deleted', 'info');
      await fetchDestinations();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Destinations</h1>
          <p className="text-xs text-slate-400 mt-1">Add, update, or remove destinations from Exploria inventory.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">Destination</th>
              <th className="p-3">Location</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {destinations.map((d) => (
              <tr key={d.id} className="hover:bg-slate-800/50">
                <td className="p-3 font-bold text-white flex items-center gap-3">
                  <img src={d.image_url} alt={d.name} className="w-9 h-9 rounded-xl object-cover" />
                  <span>{d.name}</span>
                </td>
                <td className="p-3">{d.country_state}</td>
                <td className="p-3 font-bold text-emerald-400">${d.estimated_budget}</td>
                <td className="p-3 text-amber-400 font-bold">{d.rating}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleOpenEdit(d)} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-teal-400">{editingId ? 'Edit Destination' : 'New Destination'}</h3>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <input type="text" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <input type="text" placeholder="Country / State" required value={form.country_state} onChange={(e) => setForm({ ...form, country_state: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <textarea placeholder="Description" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <input type="text" placeholder="Image URL" required value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Best Time" value={form.best_time} onChange={(e) => setForm({ ...form, best_time: e.target.value })} className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
                <input type="number" placeholder="Budget ($)" value={form.estimated_budget} onChange={(e) => setForm({ ...form, estimated_budget: e.target.value })} className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              </div>
              <input type="text" placeholder="Activities (Comma separated)" value={form.popular_activities} onChange={(e) => setForm({ ...form, popular_activities: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <button type="submit" className="w-full py-3 bg-teal-500 font-bold rounded-xl text-white">{editingId ? 'Save Changes' : 'Create Destination'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
