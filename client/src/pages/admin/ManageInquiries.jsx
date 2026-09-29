import React, { useState, useEffect } from 'react';
import { inquiryService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Search, Trash2 } from 'lucide-react';

export default function ManageInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchInquiries();
  }, [search, status]);

  async function fetchInquiries() {
    try {
      setLoading(true);
      const res = await inquiryService.getAll({ search, status });
      if (res.success) setInquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const res = await inquiryService.updateStatus(id, newStatus);
      if (res.success) {
        showToast(`Inquiry status updated to ${newStatus}`, 'success');
        await fetchInquiries();
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await inquiryService.delete(id);
      showToast('Inquiry deleted', 'info');
      await fetchInquiries();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Travel Inquiries</h1>
          <p className="text-xs text-slate-400 mt-1">Review traveler inquiry reference IDs, assign status, or delete resolved entries.</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search REF ID, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 font-bold"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">Reference ID</th>
              <th className="p-3">Traveler</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-slate-800/50">
                <td className="p-3 font-bold text-amber-400">{inq.reference_id}</td>
                <td className="p-3">
                  <div className="font-bold text-white">{inq.name}</div>
                  <div className="text-[10px] text-slate-400">{inq.email}</div>
                </td>
                <td className="p-3 font-semibold text-slate-200">{inq.subject}</td>
                <td className="p-3">
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-teal-400 font-bold rounded-lg p-1.5 text-xs"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(inq.id)} className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg">
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
