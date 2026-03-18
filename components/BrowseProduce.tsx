import React, { useState, useEffect } from 'react';
import { ProductListing } from '../types';
import { api } from '../services/api';

const CATEGORY_EMOJIS: Record<string, string> = {
  Vegetables: '🥦', Fruits: '🍎', Grains: '🌾',
  Pulses: '🫘', Spices: '🌶️', Dairy: '🥛', Other: '🌿',
};

const BrowseProduce: React.FC = () => {
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ordered, setOrdered] = useState<string | null>(null);

  const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Other'];

  useEffect(() => {
    api.getProductListings().then(data => {
      setListings(data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'All'
    ? listings
    : listings.filter(l => (l as any).category === filter);

  const addToCart = (id: string) => setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const removeFromCart = (id: string) => setCart(c => {
    const next = { ...c };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  });

  const totalItems = Object.values(cart).reduce((a: number, b: number) => a + b, 0);
  const totalPrice = listings.reduce((sum: number, l) => sum + (cart[l.id] ?? 0) * l.price, 0);

  const handleOrder = () => {
    setOrdered(`✅ Order placed! ${totalItems} items for ₹${totalPrice.toFixed(0)} — farmer will be notified.`);
    setCart({});
    setTimeout(() => setOrdered(null), 4000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fresh Produce</h1>
          <p className="text-sm text-gray-500 mt-0.5">Directly from local farmers</p>
        </div>
        <div className="relative">
          <span className="text-3xl">🛒</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </div>

      {/* Success toast */}
      {ordered && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl px-4 py-3 text-sm font-medium animate-fade-in">
          {ordered}
        </div>
      )}

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${filter === cat
              ? 'bg-green-600 text-white shadow'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'
              }`}
          >
            {cat !== 'All' ? `${CATEGORY_EMOJIS[cat] ?? '🌿'} ` : ''}{cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-44 w-full" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-8 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p className="text-4xl mb-3">{filter === 'All' ? '🌽' : CATEGORY_EMOJIS[filter] ?? '🌿'}</p>
          <p className="font-semibold text-gray-600">
            {filter === 'All' ? 'No produce listed yet' : `No ${filter} available right now`}
          </p>
          <p className="text-sm text-gray-400 mt-1">Check back later — farmers are adding fresh stock!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(item => {
            const qty = cart[item.id] ?? 0;
            const cat = (item as any).category ?? 'Other';
            return (
              <div key={item.id} className="card overflow-hidden flex flex-col group">
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => (e.currentTarget.src = `https://placehold.co/400x240/f0fdf4/16a34a?text=${encodeURIComponent(CATEGORY_EMOJIS[cat] ?? '🌿')}`)} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-green-50">
                      {CATEGORY_EMOJIS[cat] ?? '🌿'}
                    </div>
                  )}
                  {/* Badges */}
                  <span className="absolute top-2 left-2 bg-white/90 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {CATEGORY_EMOJIS[cat] ?? '🌿'} {cat}
                  </span>
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                    ₹{item.price}/unit
                  </span>
                </div>
                {/* Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    📦 Available: <span className="font-semibold text-gray-700">{item.quantity}</span>
                  </p>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{item.description}</p>
                  )}
                  {/* Cart controls */}
                  <div className="mt-3">
                    {qty === 0 ? (
                      <button onClick={() => addToCart(item.id)}
                        className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2">
                        🛒 Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 rounded-xl px-3 py-1.5 border border-green-200">
                        <button onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-full bg-white shadow text-green-700 font-bold text-lg flex items-center justify-center active:scale-90 transition-transform">
                          −
                        </button>
                        <span className="font-bold text-green-800">{qty} × ₹{(qty * item.price).toFixed(0)}</span>
                        <button onClick={() => addToCart(item.id)}
                          className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-lg flex items-center justify-center active:scale-90 transition-transform">
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky order bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-[3.75rem] left-0 right-0 px-4 py-3 z-10">
          <button
            onClick={handleOrder}
            className="w-full max-w-lg mx-auto flex items-center justify-between bg-green-600 text-white rounded-2xl px-5 py-3.5 shadow-xl active:scale-98 transition-transform"
          >
            <span className="font-semibold">{totalItems} item{totalItems > 1 ? 's' : ''}</span>
            <span className="font-bold text-lg">Place Order · ₹{totalPrice.toFixed(0)}</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseProduce;
