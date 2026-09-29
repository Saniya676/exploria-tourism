import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function addToast(message, type = 'info') {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 rounded-xl shadow-xl text-white transition-all transform animate-bounce-short ${
              toast.type === 'success'
                ? 'bg-teal-600'
                : toast.type === 'error'
                ? 'bg-rose-600'
                : 'bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
