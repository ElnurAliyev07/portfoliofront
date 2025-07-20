import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const showToast = useCallback((options) => {
    toast(options.title, {
      description: options.description,
      duration: 4000,
      ...(options.variant === 'destructive' && { style: { background: '#ef4444', color: '#fff' } }),
    });
  }, []);

  return { toast: showToast };
};