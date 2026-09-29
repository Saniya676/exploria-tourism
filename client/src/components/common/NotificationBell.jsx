import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check, BookmarkCheck, MessageSquare, Info } from 'lucide-react';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  async function fetchNotifications() {
    try {
      const res = await notificationService.getAll();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      // silent
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error(err);
    }
  }

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-white space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-bold text-xs">Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="text-[10px] text-teal-400 font-bold hover:underline flex items-center gap-1">
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`p-2.5 rounded-xl border text-xs space-y-1 ${n.is_read ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-800 border-teal-500/30 text-white'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-teal-300">{n.title}</span>
                    <span className="text-[9px] text-slate-500">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] leading-tight">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
