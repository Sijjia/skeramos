'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  text: string;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((type: ToastMessage['type'], text: string) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, text }]);

    // Автоматически убираем через 4 секунды
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((text: string) => show('success', text), [show]);
  const error = useCallback((text: string) => show('error', text), [show]);
  const info = useCallback((text: string) => show('info', text), [show]);

  return { toasts, success, error, info };
}

export function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const colors = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border text-white text-sm shadow-lg
        transition-all duration-300
        ${colors[toast.type]}
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
      `}
    >
      <span className="text-lg font-bold">{icons[toast.type]}</span>
      <span>{toast.text}</span>
    </div>
  );
}
