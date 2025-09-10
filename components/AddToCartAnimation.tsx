import React, { useState, useEffect, useRef, MutableRefObject } from 'react';

interface AddToCartAnimationProps {
  item: { imageUrl: string; startRect: DOMRect };
  targetRef: MutableRefObject<HTMLButtonElement | null>;
  onAnimationEnd: () => void;
}

export const AddToCartAnimation: React.FC<AddToCartAnimationProps> = ({ item, targetRef, onAnimationEnd }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});
  
  useEffect(() => {
    const start = item.startRect;
    const end = targetRef.current?.getBoundingClientRect();
    
    // Set initial position and style based on the source element
    setStyle({
      position: 'fixed',
      top: `${start.top}px`,
      left: `${start.left}px`,
      width: `${start.width}px`,
      height: `${start.height}px`,
      zIndex: 200,
      transition: 'all 0.8s cubic-bezier(0.5, 0, 0.75, 0.2)', // Ease-in curve with a soft end
      opacity: 1,
      borderRadius: '0.75rem',
      overflow: 'hidden',
    });

    // Animate to target after a short delay to allow the element to render
    const timeoutId = setTimeout(() => {
      if (end) {
        setStyle(prev => ({
          ...prev,
          top: `${end.top + end.height / 4}px`,
          left: `${end.left + end.width / 4}px`,
          width: '0px',
          height: '0px',
          opacity: 0.3,
          transform: 'rotate(180deg)',
        }));
      }
    }, 30);

    // Clean up animation state after it finishes
    const animationEndTimeout = setTimeout(onAnimationEnd, 830);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(animationEndTimeout);
    };
  }, [item, onAnimationEnd, targetRef]);

  return (
    <div style={style}>
      <img src={item.imageUrl} alt="Adding to cart" className="w-full h-full object-cover" />
    </div>
  );
};
