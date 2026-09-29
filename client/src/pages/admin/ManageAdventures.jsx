import React, { useState, useEffect } from 'react';
import { adventureService, destinationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Flame, Plus, Trash2 } from 'lucide-react';

export default function ManageAdventures() {
  const [adventures, setAdventures] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    destination_id: 1,
    name: '',
    category: 'Trekking',
    description: '',
    duration: '1 Day',
    difficulty: 'Moderate',
    price: 99,
    best_time: 'Round the year',
    safety_info: 'Follow guide safety instructions.',
    required_equipment: 'Hiking boots, Water bottle',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [aRes, dRes] = await Promise.all([
        adventureService.getAll(),
        destinationService.getAll()
      ]);
      if (aRes.success) setAdventures(aRes.data);
      if (dRes.success) setDestinations(dRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await adventureService.create(form);
      showToast('Adventure created successfully', 'success');
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Create failed', 'error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete adventure?')) return;
    try {
      await adventureService.delete(id);
      showToast('Adventure deleted', 'info');
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Adventures & Activities</h1>
          <p className="text-xs text-slate-400 mt-1">Configure adventure activities linked to destinations.</p>
        </div>

        <button onClick={() => setModalOpen(true)} className="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Adventure
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">Adventure</th>
              <th className="p-3">Category</th>
              <th className="p-3">Difficulty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {adventures.map((a) => (
              <tr key={a.id} className="hover:bg-slate-800/50">
                <td className="p-3 font-bold text-white flex items-center gap-3">
                  <img src={a.image_url} alt={a.name} className="w-9 h-9 rounded-xl object-cover" />
                  <span>{a.name}</span>
                </td>
                <td className="p-3">{a.category}</td>
                <td className="p-3">{a.difficulty}</td>
                <td className="p-3 font-bold text-emerald-400">${a.price}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg">
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
              <h3 className="font-bold text-base text-teal-400">Add New Adventure</h3>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <input type="text" placeholder="Adventure Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <select value={form.destination_id} onChange={(e) => setForm({ ...form, destination_id: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white">
                {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white font-bold">
                <option value="Trekking">Trekking</option>
                <option value="Scuba Diving">Scuba Diving</option>
                <option value="Rafting">Rafting</option>
                <option value="Paragliding">Paragliding</option>
                <option value="Bungee Jumping">Bungee Jumping</option>
                <option value="Camping">Camping</option>
              </select>
              <textarea placeholder="Description" required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Price ($)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
                <input type="text" placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              </div>
              <button type="submit" className="w-full py-3 bg-teal-500 font-bold rounded-xl text-white">Create Adventure</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
