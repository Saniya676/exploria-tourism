import React, { useState, useEffect } from 'react';
import { packageService, destinationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Package, Plus, Trash2, Edit3 } from 'lucide-react';

export default function ManagePackages() {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    destination_id: 1,
    title: '',
    cover_image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000',
    description: '',
    duration_days: 4,
    price: 299,
    difficulty: 'Moderate',
    best_season: 'June to October',
    included_services: 'Hotel Stay, Meals, Permits, Guide',
    excluded_services: 'Personal Expenses, Flights',
    max_participants: 12,
    featured: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [pRes, dRes] = await Promise.all([
        packageService.getAll(),
        destinationService.getAll()
      ]);
      if (pRes.success) setPackages(pRes.data);
      if (dRes.success) setDestinations(dRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleCreateOpen() {
    setEditingId(null);
    setForm({
      destination_id: destinations[0]?.id || 1,
      title: '',
      cover_image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000',
      description: '',
      duration_days: 4,
      price: 299,
      difficulty: 'Moderate',
      best_season: 'June to October',
      included_services: 'Hotel Stay, Meals, Permits, Guide',
      excluded_services: 'Personal Expenses, Flights',
      max_participants: 12,
      featured: true
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const inc = form.included_services.split(',').map(s => s.trim()).filter(Boolean);
      const exc = form.excluded_services.split(',').map(s => s.trim()).filter(Boolean);
      const payload = { ...form, included_services: inc, excluded_services: exc };

      if (editingId) {
        await packageService.update(editingId, payload);
        showToast('Package updated', 'success');
      } else {
        await packageService.create(payload);
        showToast('Package created', 'success');
      }

      setModalOpen(false);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete package?')) return;
    try {
      await packageService.delete(id);
      showToast('Package deleted', 'info');
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Adventure Packages</h1>
          <p className="text-xs text-slate-400 mt-1">Create, update, or remove tour package offerings.</p>
        </div>

        <button onClick={handleCreateOpen} className="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Destination</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-slate-800/50">
                <td className="p-3 font-bold text-white flex items-center gap-3">
                  <img src={pkg.cover_image} alt={pkg.title} className="w-9 h-9 rounded-xl object-cover" />
                  <span className="truncate max-w-xs">{pkg.title}</span>
                </td>
                <td className="p-3">{pkg.destination_name}</td>
                <td className="p-3">{pkg.duration_days} Days</td>
                <td className="p-3 font-bold text-emerald-400">${pkg.price}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleDelete(pkg.id)} className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg">
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
              <h3 className="font-bold text-base text-teal-400">Add New Tour Package</h3>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <input type="text" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <select value={form.destination_id} onChange={(e) => setForm({ ...form, destination_id: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white">
                {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <textarea placeholder="Description" required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <input type="text" placeholder="Cover Image URL" required value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Price ($)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
                <input type="number" placeholder="Days" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })} className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              </div>
              <input type="text" placeholder="Included Services (Comma separated)" value={form.included_services} onChange={(e) => setForm({ ...form, included_services: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-white" />
              <button type="submit" className="w-full py-3 bg-teal-500 font-bold rounded-xl text-white">Create Package</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
