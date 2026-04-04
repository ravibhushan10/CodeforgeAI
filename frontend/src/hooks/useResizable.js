import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useResizable — drag handle to resize two panels
 * @param {string} storageKey  — localStorage key to persist size
 * @param {number} defaultSize — initial size in px
 * @param {'horizontal'|'vertical'} direction
 * @param {number} min — minimum size in px
 * @param {number} max — maximum size in px
 */
export function useResizable(storageKey, defaultSize, direction = 'horizontal', min = 200, max = 800) {
  const saved  = storageKey ? parseInt(localStorage.getItem(storageKey)) : null;
  const [size, setSize] = useState(saved && saved >= min && saved <= max ? saved : defaultSize);
  const dragging = useRef(false);
  const startPos = useRef(0);
  const startSize = useRef(0);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    startPos.current  = direction === 'horizontal' ? e.clientX : e.clientY;
    startSize.current = size;
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }, [size, direction]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const pos   = direction === 'horizontal' ? e.clientX : e.clientY;
      const delta = direction === 'vertical'
  ? startPos.current - pos
  : pos - startPos.current;
      const next  = Math.min(max, Math.max(min, startSize.current + delta));
      setSize(next);
      if (storageKey) localStorage.setItem(storageKey, String(Math.round(next)));
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchmove', (e) => onMove(e.touches[0]));
    window.addEventListener('touchend',  onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [direction, min, max, storageKey]);

  return { size, onMouseDown };
}
