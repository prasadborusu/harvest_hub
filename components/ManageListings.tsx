
import React, { useState, useEffect } from 'react';
import { Fertilizer } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';

const INPUT_CLASS =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 ' +
  'focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition placeholder-gray-400';

const ManageListings: React.FC = () => {
  const [listings, setListings] = useState<Fertilizer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    api.getFertilizerListings().then(setListings);
  }, []);

  const resetForm = () => {
    setShowForm(false); setEditingId(null);
    setName(''); setPrice(''); setDescription(''); setImagePreview('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const b64 = await fileToBase64(file);
      setImagePreview(`data:${file.type};base64,${b64}`);
    }
  };

  const handleEditClick = (item: Fertilizer) => {
    setEditingId(item.id); setName(item.name); setPrice(item.price.toString());
    setDescription(item.description); setImagePreview(item.imageUrl); setShowForm(true);
  };

  const handleRemove = async (id: string) => {
    const updated = listings.filter(l => l.id !== id);
    setListings(updated);
    await api.saveFertilizerListings(updated);
    setConfirmRemoveId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Fertilizer[];
    if (editingId) {
      updated = listings.map(l =>
        l.id === editingId
          ? { ...l, name, price: parseFloat(price), description, imageUrl: imagePreview }
          : l
      );
    } else {
      updated = [...listings, { id: Date.now().toString(), name, price: parseFloat(price), description, imageUrl: imagePreview }];
    }
    setListings(updated);
    await api.saveFertilizerListings(updated);
    resetForm();
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('manageListings.title')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{listings.length} product{listings.length !== 1 ? 's' : ''} listed</p>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${showForm
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700'
            }`}
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5 animate-fade-in">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {editingId ? t('manageListings.editListingTitle') : t('manageListings.newListingTitle')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                  {t('manageListings.productName')}
                </label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className={INPUT_CLASS} placeholder="e.g. DAP Fertilizer" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                  {t('manageListings.price')} (₹)
                </label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                  className={INPUT_CLASS} placeholder="e.g. 550" required />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                {t('manageListings.description')}
              </label>
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
                className={INPUT_CLASS} placeholder="Describe the product..." required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                {t('manageListings.productImage')}
              </label>
              <input type="file" accept="image/*" onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" />
              {imagePreview && (
                <img src={imagePreview} alt="preview"
                  className="mt-3 h-28 w-28 object-cover rounded-xl shadow" />
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={resetForm}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition-all">
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2 text-sm">
                {editingId ? t('manageListings.updateListing') : t('manageListings.listProduct')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listings Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((item) => (
            <div key={item.id} className="card overflow-hidden flex flex-col group">
              <div className="relative h-40 overflow-hidden bg-gray-100">
                <img src={item.imageUrl} alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={e => (e.currentTarget.src = 'https://placehold.co/400x240/f0fdf4/16a34a?text=🌿')} />
                <span className="absolute bottom-2 left-2 bg-white/90 text-green-700 font-bold text-sm px-2.5 py-0.5 rounded-full">
                  ₹{item.price}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-1 line-clamp-2">{item.description}</p>
                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleEditClick(item)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95 transition-all">
                    ✏️ {t('manageListings.edit')}
                  </button>
                  {confirmRemoveId === item.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleRemove(item.id)}
                        className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all">
                        Confirm
                      </button>
                      <button onClick={() => setConfirmRemoveId(null)}
                        className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all">
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmRemoveId(item.id)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 active:scale-95 transition-all">
                      🗑️ {t('manageListings.remove')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-semibold text-gray-600">{t('manageListings.noListings')}</p>
            <p className="text-sm text-gray-400 mt-1">{t('manageListings.noListingsSub')}</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-5 px-6 py-2 text-sm">
              + Add First Product
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default ManageListings;
