import { useEffect } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface KeyMap {
  [key: string]: KeyHandler;
}

export const useKeyboardShortcuts = (keyMap: KeyMap) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const hasCtrl = event.ctrlKey || event.metaKey;
      
      let shortcutKey = key;
      
      if (hasCtrl) {
        shortcutKey = `ctrl+${key}`;
      }
      
      if (keyMap[shortcutKey]) {
        event.preventDefault();
        keyMap[shortcutKey](event);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyMap]);
};