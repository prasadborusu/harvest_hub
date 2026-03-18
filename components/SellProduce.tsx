import React, { useState, useEffect } from 'react';
import { ProductListing } from '../types';
import { api } from '../services/api';
import { fileToBase64 } from '../utils/fileUtils';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Other'];

const INPUT_CLASS =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 ' +
    'focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition placeholder-gray-400';

const SellProduce: React.FC = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState<ProductListing[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        api.getProductListings().then(setListings);
    }, []);

    const resetForm = () => {
        setShowForm(false); setEditingId(null);
        setName(''); setCategory(CATEGORIES[0]); setPrice('');
        setQuantity(''); setDescription(''); setImagePreview('');
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const b64 = await fileToBase64(file);
            setImagePreview(`data:${file.type};base64,${b64}`);
        }
    };

    const handleEdit = (item: ProductListing) => {
        setEditingId(item.id);
        setName(item.name);
        setCategory((item as any).category ?? CATEGORIES[0]);
        setPrice(item.price.toString());
        setQuantity(item.quantity);
        setDescription(item.description);
        setImagePreview(item.imageUrl);
        setShowForm(true);
    };

    const handleRemove = async (id: string) => {
        const updated = listings.filter(l => l.id !== id);
        setListings(updated);
        await api.saveProductListings(updated);
        setConfirmRemoveId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let updated: ProductListing[];
        if (editingId) {
            updated = listings.map(l =>
                l.id === editingId
                    ? { ...l, name, price: parseFloat(price), quantity, description, imageUrl: imagePreview, category }
                    : l
            );
        } else {
            const newItem: ProductListing = {
                id: Date.now().toString(),
                name,
                price: parseFloat(price),
                quantity,
                description,
                imageUrl: imagePreview,
                ...(({ category }) as any),
            };
            // Attach category as extra field
            (newItem as any).category = category;
            updated = [...listings, newItem];
        }
        setListings(updated);
        await api.saveProductListings(updated);
        resetForm();
    };

    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Produce</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {user?.displayName} · {listings.length} listing{listings.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => (showForm ? resetForm() : setShowForm(true))}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${showForm
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'btn-primary'
                        }`}
                >
                    {showForm ? '✕ Cancel' : '+ List Produce'}
                </button>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="card p-5 animate-fade-in">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        {editingId ? '✏️ Edit Listing' : '🌽 New Produce Listing'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                                    Produce Name *
                                </label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)}
                                    className={INPUT_CLASS} placeholder="e.g. Fresh Tomatoes" required />
                            </div>
                            {/* Category */}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                                    Category *
                                </label>
                                <select value={category} onChange={e => setCategory(e.target.value)}
                                    className={INPUT_CLASS}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            {/* Price */}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                                    Price (₹ per unit) *
                                </label>
                                <input type="number" min="0" step="0.5" value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    className={INPUT_CLASS} placeholder="e.g. 40" required />
                            </div>
                            {/* Quantity */}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                                    Available Quantity *
                                </label>
                                <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)}
                                    className={INPUT_CLASS} placeholder="e.g. 50 kg" required />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                                Description
                            </label>
                            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)}
                                className={INPUT_CLASS} placeholder="Fresh, organically grown, pesticide-free…" />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                                Product Photo
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
                                {editingId ? '💾 Update' : '📤 List Now'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Listings */}
            {listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listings.map(item => (
                        <div key={item.id} className="card overflow-hidden flex flex-col group">
                            {/* Image */}
                            <div className="relative h-44 overflow-hidden bg-gray-100">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={e => (e.currentTarget.src = 'https://placehold.co/400x240/f0fdf4/16a34a?text=🌿')} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl bg-green-50">🌿</div>
                                )}
                                {/* Category badge */}
                                <span className="absolute top-2 left-2 bg-white/90 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {(item as any).category ?? 'Produce'}
                                </span>
                                {/* Price badge */}
                                <span className="absolute bottom-2 right-2 bg-green-600 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                                    ₹{item.price}
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

                                {/* Actions */}
                                <div className="mt-3 flex gap-2">
                                    <button onClick={() => handleEdit(item)}
                                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95 transition-all">
                                        ✏️ Edit
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
                                            🗑️ Remove
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
                        <p className="text-5xl mb-3">🥕</p>
                        <p className="font-semibold text-gray-700 text-lg">No produce listed yet</p>
                        <p className="text-sm text-gray-400 mt-1 mb-5">Start selling your vegetables, fruits & more</p>
                        <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-2.5 text-sm">
                            + List Your First Produce
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default SellProduce;
