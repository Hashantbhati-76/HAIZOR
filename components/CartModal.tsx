import React, { useEffect, useRef } from 'react';
import type { CartItem } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';


interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemove: (artworkId: number) => void;
  onUpdateQuantity: (artworkId: number, newQuantity: number) => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, onRemove, onUpdateQuantity }) => {
  const cartListRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
    
  useEffect(() => {
    if (isOpen && cartItems.length > 0 && cartListRef.current) {
      const { current } = cartListRef;
      // Scroll to the bottom to show the latest item
      current.scrollTop = current.scrollHeight;
    }
  }, [isOpen, cartItems]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className={`fixed top-4 right-4 bottom-4 w-11/12 max-w-sm bg-brand-surface/80 backdrop-blur-xl border border-brand-glass-border shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'translate-x-0' : 'translate-x-[105%]'} overflow-hidden rounded-2xl`}>
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/subtle-grunge.png)' }}/>
            <div className="relative flex items-center justify-between p-6 border-b border-brand-glass-border">
                <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                <button onClick={onClose} className="p-2 text-white/70 hover:text-white" aria-label="Close cart">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>

            <div ref={cartListRef} className="relative flex-grow p-6 overflow-y-auto">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <p className="text-brand-text-muted text-lg">Your cart is empty.</p>
                        <button onClick={onClose} className="mt-4 px-6 py-2 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary-hover transition-all duration-300">
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                                <img src={item.imageUrl} alt={item.title} className="w-20 h-24 object-cover rounded" />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-white">{item.title}</h3>
                                    <p className="text-sm text-brand-text-muted">${item.price.toLocaleString()}</p>
                                    <div className="flex items-center mt-2">
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1.5 bg-white/10 rounded-full text-white" aria-label={`Decrease quantity of ${item.title}`}>
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1.5 bg-white/10 rounded-full text-white" aria-label={`Increase quantity of ${item.title}`}>
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <button onClick={() => onRemove(item.id)} className="p-2 text-brand-text-muted hover:text-red-500 transition-colors" aria-label={`Remove ${item.title} from cart`}>
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {cartItems.length > 0 && (
                 <div className="relative p-6 border-t border-brand-glass-border">
                    <div className="flex justify-between items-center mb-4 text-lg">
                        <span className="text-brand-text-muted">Subtotal:</span>
                        <span className="font-bold text-white">${subtotal.toLocaleString()}</span>
                    </div>
                    <button className="w-full px-8 py-4 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary-hover transition-all duration-300 shadow-lg">
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};