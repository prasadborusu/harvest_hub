
import React, { useState, useEffect } from 'react';
import { Fertilizer } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';

const FertilizerStore: React.FC = () => {
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    api.getFertilizerListings().then((data) => {
      setFertilizers(data);
      setLoading(false);
    });
  }, []);

  const handleBuy = (name: string) => {
    alert(`✅ "${name}" added to cart!\n(Payment integration coming soon)`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('fertilizerStore.title')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quality inputs for healthy crops</p>
        </div>
        <span className="text-3xl">🌿</span>
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
                <div className="skeleton h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : fertilizers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p className="text-4xl mb-3">🏪</p>
          <p className="font-semibold text-gray-600">{t('fertilizerStore.noListings')}</p>
          <p className="text-sm text-gray-400 mt-1">{t('fertilizerStore.noListingsSub')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fertilizers.map((item) => (
            <div key={item.id} className="card overflow-hidden flex flex-col group">
              {/* Image with overlay */}
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x240/f0fdf4/16a34a?text=🌿')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {/* Price badge */}
                <span className="absolute bottom-3 left-3 bg-white/90 text-green-700 font-bold text-sm px-2.5 py-1 rounded-full shadow">
                  ₹{item.price}
                </span>
              </div>
              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800 leading-snug">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-1 line-clamp-2">{item.description}</p>
                <button
                  onClick={() => handleBuy(item.name)}
                  className="btn-primary mt-4 w-full text-sm flex items-center justify-center gap-2"
                >
                  <span>🛒</span> {t('fertilizerStore.buyNow')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FertilizerStore;
