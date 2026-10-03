import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-auto sm:top-4 sm:left-auto sm:right-4 z-[9999] flex flex-col gap-3 pointer-events-none sm:max-w-sm">
      {toasts.map(toast => {
        let Icon = Info;
        let bgClass = 'bg-white border-blue-200';
        let iconClass = 'text-blue-500';
        let barClass = 'bg-blue-500';

        if (toast.type === 'success') {
          Icon = CheckCircle;
          bgClass = 'bg-white border-green-200';
          iconClass = 'text-green-500';
          barClass = 'bg-green-500';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          bgClass = 'bg-white border-red-200';
          iconClass = 'text-red-500';
          barClass = 'bg-red-500';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          bgClass = 'bg-white border-orange-200';
          iconClass = 'text-orange-500';
          barClass = 'bg-orange-500';
        }

        return (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-premium border-l-4 ${bgClass} ${barClass.replace('bg-', 'border-l-')} transform transition-all duration-300 animate-slide-in-right relative overflow-hidden`}
            role="alert"
          >
            <div className={`flex-shrink-0 mr-3 mt-0.5 ${iconClass}`}>
              <Icon size={20} />
            </div>
            <div className="flex-1 mr-4">
              <p className="text-sm font-semibold text-gray-800 leading-snug">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 rounded"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div 
              className={`absolute bottom-0 left-0 h-1 ${barClass} animate-shrink-width`}
              style={{ animationDuration: `${toast.duration}ms` }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
