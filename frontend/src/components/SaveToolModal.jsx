import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import useBookmarks from '../hooks/Bookmarks';

const SaveToolModal = ({ isOpen, onClose, toolId }) => {
    const { bookmarks, createCollection, addToolToCollection, removeToolFromCollection } = useBookmarks();
    const [newCollectionName, setNewCollectionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    if (!isOpen) return null;

    const handleToggleCollection = async (collection) => {
        const isSaved = collection.tools.some(t => t.tool === toolId || t.tool._id === toolId);

        try {
            if (isSaved) {
                await removeToolFromCollection({ collectionId: collection._id, toolId });
            } else {
                await addToolToCollection({ collectionId: collection._id, toolId });
            }
        } catch (error) {
            console.error("Failed to toggle bookmark", error);
        }
    };

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;

        try {
            setIsCreating(true);
            const newCollection = await createCollection({ name: newCollectionName });
            // Automatically add tool to new collection
            if (newCollection && newCollection._id) {
                await addToolToCollection({ collectionId: newCollection._id, toolId });
            }
            setNewCollectionName('');
        } catch (error) {
            console.error("Failed to create collection", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Save to Collection</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Collections List */}
                <div className="max-h-64 overflow-y-auto p-2">
                    {bookmarks.length === 0 ? (
                        <p className="text-center text-gray-500 py-4 text-sm">No collections yet. Create one below!</p>
                    ) : (
                        <div className="space-y-1">
                            {bookmarks.map(collection => {
                                const isSaved = collection.tools?.some(t => t.tool === toolId || t.tool._id === toolId);
                                return (
                                    <button
                                        key={collection._id}
                                        onClick={() => handleToggleCollection(collection)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSaved ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                                                {isSaved ? <Check size={20} /> : <span className="text-lg font-bold">{collection.name[0].toUpperCase()}</span>}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-gray-900">{collection.name}</p>
                                                <p className="text-xs text-gray-500">{collection.tools?.length || 0} items</p>
                                            </div>
                                        </div>
                                        {isSaved && <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Create New Collection */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <form onSubmit={handleCreateCollection} className="flex gap-2">
                        <input
                            type="text"
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            placeholder="New collection name..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newCollectionName.trim() || isCreating}
                            className="px-4 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isCreating ? 'Creating...' : 'Create'}
                        </button>
                    </form>
                </div>

                <div className="p-3 border-t border-gray-100 text-center">
                    <button onClick={onClose} className="text-sm text-indigo-600 font-semibold hover:text-indigo-800">Done</button>
                </div>
            </div>
        </div>
    );
};

export default SaveToolModal;
