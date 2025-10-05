'use client';

import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  open: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

export default function Toast({ message, open, onClose, type = 'success' }: ToastProps) {
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => onClose(), 5000);
      return () => clearTimeout(t);
    }
  }, [open, onClose]);

  if (!open) return null;

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  }[type];

  return (
    <div className={`fixed right-4 bottom-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-xl z-50 max-w-sm animate-slide-in-right`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
