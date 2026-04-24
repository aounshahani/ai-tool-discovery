import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, Folder, ExternalLink, X } from "lucide-react";
import useBookmarks from "../hooks/Bookmarks";

const Bookmarks = () => {
  const {
    bookmarks,
    loading,
    error,
    createCollection,
    removeToolFromCollection,
    deleteCollection,
  } = useBookmarks();

  const [searchQuery, setSearchQuery] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Advanced Search Logic
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks;

    const query = searchQuery.toLowerCase();
    return bookmarks.filter(collection => {
      // Match collection name
      if (collection.name.toLowerCase().includes(query)) return true;

      // Match tools inside collection
      return collection.tools?.some(t =>
        t.tool.name?.toLowerCase().includes(query) ||
        t.tool.description?.toLowerCase().includes(query)
      );
    });
  }, [bookmarks, searchQuery]);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      setIsCreating(true);
      await createCollection({ name: newCollectionName });
      setNewCollectionName("");
    } catch (err) {
      console.error("Failed to create collection", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Folder className="fill-indigo-100 text-indigo-600" />
          My Collections
        </h1>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search collections or tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {/* Create Collection Inline */}
      <form onSubmit={handleCreateCollection} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-3 items-center max-w-2xl">
        <input
          type="text"
          placeholder="Create new collection..."
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!newCollectionName.trim() || isCreating}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isCreating ? 'Creating...' : 'Create'}
        </button>
      </form>

      {/* Loading & Error */}
      {loading && <div className="text-center py-12 text-gray-500">Loading collections...</div>}
      {error && <div className="text-center py-4 text-red-500 bg-red-50 rounded-lg mb-6">{error}</div>}

      {/* Collections Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              {searchQuery ? "No collections found matching your search." : "No collections yet. Create one above!"}
            </div>
          ) : (
            filteredBookmarks.map((collection) => (
              <div key={collection._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900 truncate pr-2">{collection.name}</h2>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this collection?')) deleteCollection(collection._id);
                    }}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete Collection"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Tools List */}
                <div className="p-4 flex-1 overflow-y-auto max-h-64">
                  {collection.tools && collection.tools.length > 0 ? (
                    <ul className="space-y-3">
                      {collection.tools.map((item) => (
                        <li key={item.tool._id || item._id} className="flex items-start gap-3 group">
                          {item.tool.logo ? (
                            <img src={item.tool.logo} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                              {item.tool.name?.[0] || '?'}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <Link to={`/tools/${item.tool._id}`} className="font-medium text-gray-900 hover:text-indigo-600 truncate block">
                              {item.tool.name}
                            </Link>
                            <p className="text-xs text-gray-500 truncate">{item.tool.category?.replace('_', ' ')}</p>
                          </div>

                          <button
                            onClick={() => removeToolFromCollection({ collectionId: collection._id, toolId: item.tool._id })}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-all"
                            title="Remove from collection"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm py-8">
                      <Folder size={32} className="mb-2 opacity-20" />
                      <p>Empty collection</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
                  {collection.tools?.length || 0} items
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
