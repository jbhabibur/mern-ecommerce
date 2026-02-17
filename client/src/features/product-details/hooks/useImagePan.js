import { useState, useRef } from "react";

export const useImagePan = (containerRef, imageRef) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const start = useRef({ x: 0, y: 0 });
  const pinchStart = useRef({ distance: 0, scale: 1 });

  // Toggle zoom
  const toggleZoom = () => {
    if (!isZoomed) {
      setScale(3);
      setIsZoomed(true);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsZoomed(false);
    }
  };

  // --- Desktop Mouse ---
  const handleMouseDown = (e) => {
    if (!isZoomed || e.button !== 0) return;
    setIsDragging(true);
    start.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    pan(e.clientX, e.clientY);
  };
  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    snapBounds();
  };
  const handleWheel = (e) => {
    e.preventDefault();
    let newScale = scale - e.deltaY * 0.001;
    newScale = Math.min(Math.max(1, newScale), 8);
    setScale(newScale);
    snapBounds();
  };
  const handleDoubleClick = () => toggleZoom();

  // --- Mobile Touch ---
  const handleTouchStart = (e) => {
    if (!containerRef.current || !imageRef.current) return;

    if (e.touches.length === 1 && isZoomed) {
      const t = e.touches[0];
      setIsDragging(true);
      start.current = { x: t.clientX - position.x, y: t.clientY - position.y };
    } else if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      const distance = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY,
      );
      pinchStart.current = { distance, scale };
    }
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !imageRef.current) return;

    if (isDragging && e.touches.length === 1) {
      const t = e.touches[0];
      pan(t.clientX, t.clientY);
      // DO NOT snapBounds() here
    } else if (e.touches.length === 2) {
      // pinch zoom
      const [t1, t2] = e.touches;
      const distance = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY,
      );
      const factor = distance / pinchStart.current.distance;
      let newScale = Math.min(
        Math.max(1, pinchStart.current.scale * factor),
        8,
      );
      setScale(newScale);
      // Optionally, clamp scale here but do not snap position yet
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      snapBounds(); // smooth snapping after release
    }
  };

  // --- Utility functions ---
  const pan = (x, y) => {
    if (!containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const image = imageRef.current;

    // Use clientWidth/Height instead of naturalWidth/Height
    const imgWidth = image.clientWidth * scale;
    const imgHeight = image.clientHeight * scale;

    // Maximum offset allowed: (Scaled Image - Container) / 2
    const maxX = Math.max((imgWidth - container.clientWidth) / 2, 0);
    const maxY = Math.max((imgHeight - container.clientHeight) / 2, 0);

    let newX = x - start.current.x;
    let newY = y - start.current.y;

    const resistance = 0.3;

    // Apply resistance (elastic effect)
    if (newX > maxX) newX = maxX + (newX - maxX) * resistance;
    if (newX < -maxX) newX = -maxX + (newX + maxX) * resistance;
    if (newY > maxY) newY = maxY + (newY - maxY) * resistance;
    if (newY < -maxY) newY = -maxY + (newY + maxY) * resistance;

    setPosition({ x: newX, y: newY });
  };

  const snapBounds = () => {
    if (!containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const image = imageRef.current;

    // Same fix here: clientWidth/Height
    const maxX = Math.max(
      (image.clientWidth * scale - container.clientWidth) / 2,
      0,
    );
    const maxY = Math.max(
      (image.clientHeight * scale - container.clientHeight) / 2,
      0,
    );

    setPosition({
      x: Math.max(Math.min(position.x, maxX), -maxX),
      y: Math.max(Math.min(position.y, maxY), -maxY),
    });
  };

  return {
    isZoomed,
    scale,
    position,
    toggleZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
    handleWheel,
    handleDoubleClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
