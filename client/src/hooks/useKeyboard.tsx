import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface UseKeyboardProps {
  onAdminShortcut?: () => void;
}

export function useKeyboard({ onAdminShortcut }: UseKeyboardProps = {}) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + Shift + A for admin
      if (event.altKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        if (onAdminShortcut) {
          onAdminShortcut();
        } else {
          setLocation('/admin');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAdminShortcut, setLocation]);

  // Check for /admin in URL
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#/admin') {
      setLocation('/admin');
    }
  }, [setLocation]);
}