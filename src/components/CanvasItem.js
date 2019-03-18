import React from 'react';

export default function CanvasItem({children, onDelete}) {
  return (
    <div className="canvas-item">
      <button onClick={() => onDelete()}>delete</button>
      {children}
    </div>
  );
}