import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = true }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div 
        className="bg-white rounded-2xl shadow-premium w-full max-w-sm relative z-10 overflow-hidden animate-slide-in-right md:animate-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
              <AlertTriangle size={24} />
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
          <h3 id="modal-title" className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onClose}
              className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`w-full sm:w-auto flex-1 px-4 py-2.5 rounded-lg font-semibold text-white transition-colors ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-light'}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
