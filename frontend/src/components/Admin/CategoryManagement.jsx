import React, { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../api/adminApi';
import { Edit2, Trash2, Plus, Folder } from 'lucide-react';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        icon: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await getAllCategories();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error loading categories:', error);
            // alert('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                icon: category.icon || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                icon: ''
            });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '', icon: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory._id, formData);
                alert('Category updated successfully');
            } else {
                await createCategory(formData);
                alert('Category created successfully');
            }
            handleCloseModal();
            loadCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert(error.response?.data?.message || 'Error saving category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await deleteCategory(id);
            alert('Category deleted successfully');
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert(error.response?.data?.message || 'Error deleting category');
        }
    };

    // Auto-generate slug from name
    const handleNameChange = (e) => {
        const name = e.target.value;
        if (!editingCategory) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, name, slug }));
        } else {
            setFormData(prev => ({ ...prev, name }));
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                <div>
                    <h1 className="text-card-foreground text-2xl font-bold mb-1 flex items-center gap-2">
                        <Folder className="text-primary" /> Category Management
                    </h1>
                    <p className="text-muted-foreground">Manage tool categories and classifications</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full md:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading categories...</div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No categories found. Create one to get started.</div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/50 border-b border-border">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-muted-foreground w-16">Icon</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Name</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Slug</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Description</th>
                                        <th className="text-center p-4 font-semibold text-muted-foreground w-24">Tools</th>
                                        <th className="text-right p-4 font-semibold text-muted-foreground w-32">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {categories.map((category) => (
                                        <tr key={category._id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="p-4 text-2xl">{category.icon}</td>
                                            <td className="p-4 font-medium text-card-foreground">{category.name}</td>
                                            <td className="p-4 text-muted-foreground font-mono text-sm">{category.slug}</td>
                                            <td className="p-4 text-muted-foreground text-sm max-w-xs truncate">{category.description}</td>
                                            <td className="p-4 text-center">
                                                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                                                    {category.toolCount || 0}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(category)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-border">
                            {categories.map((category) => (
                                <div key={category._id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{category.icon}</span>
                                            <div>
                                                <h3 className="font-semibold text-card-foreground">{category.name}</h3>
                                                <p className="text-xs text-muted-foreground font-mono">{category.slug}</p>
                                            </div>
                                        </div>
                                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium">
                                            {category.toolCount || 0} Tools
                                        </span>
                                    </div>
                                    {category.description && (
                                        <p className="text-sm text-muted-foreground">{category.description}</p>
                                    )}
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => handleOpenModal(category)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6 text-card-foreground">
                            {editingCategory ? 'Edit Category' : 'New Category'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                                    placeholder="e.g. Chatbots"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-1">Slug</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm focus:outline-none"
                                    placeholder="e.g. chatbots"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-1">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                                    placeholder="e.g. 🤖"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-card-foreground mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                                    rows="3"
                                    placeholder="Optional description..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                                >
                                    {editingCategory ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
