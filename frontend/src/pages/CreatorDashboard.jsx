import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { Edit, Trash2, BarChart2, TrendingUp, Plus } from 'lucide-react';
import PremiumListingModal from '../components/PremiumListingModal';
import ToolEditModal from '../components/ToolEditModal';

const CreatorDashboard = () => {
    const { token, user } = useSelector((state) => state.auth);
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTool, setSelectedTool] = useState(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchMyTools();
    }, []);

    const fetchMyTools = async () => {
        try {
            const response = await axios.get('/tools/user/my-tools', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTools(response.data.tools);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tools:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (toolId) => {
        if (window.confirm("Are you sure you want to delete this tool? This action cannot be undone.")) {
            try {
                await axios.delete(`/tools/${toolId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTools(tools.filter(t => t._id !== toolId));
            } catch (error) {
                console.error("Error deleting tool:", error);
                alert("Failed to delete tool");
            }
        }
    };

    const handlePromote = (tool) => {
        setSelectedTool(tool);
        setShowPremiumModal(true);
    };

    const handleEdit = (tool) => {
        setSelectedTool(tool);
        setShowEditModal(true);
    };

    const getStatusBadge = (status) => {
        const styles = {
            approved: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            rejected: "bg-red-100 text-red-800"
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">Creator Dashboard</h1>
                        <p className="text-neutral-600 mt-1">Manage your AI tools and track performance</p>
                    </div>
                    <Link
                        to="/tools/new"
                        className="w-full md:w-auto bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/20"
                    >
                        <Plus size={20} />
                        Submit New Tool
                    </Link>
                </div>

                {tools.length === 0 ? (
                    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus size={32} className="text-neutral-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">No tools submitted yet</h3>
                        <p className="text-neutral-500 mb-6">Start by submitting your first AI tool to the platform.</p>
                        <Link
                            to="/tools/new"
                            className="text-primary font-medium hover:underline"
                        >
                            Submit a tool now
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-neutral-50 border-b border-neutral-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tool</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Performance</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Monetization</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                        {tools.map((tool) => (
                                            <tr key={tool._id} className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={tool.logo || "https://via.placeholder.com/40"}
                                                            alt={tool.name}
                                                            className="h-10 w-10 rounded-lg object-cover mr-3 border border-neutral-200"
                                                        />
                                                        <div>
                                                            <div className="font-medium text-neutral-900">{tool.name}</div>
                                                            <div className="text-sm text-neutral-500">{tool.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(tool.status)}
                                                    {tool.rejectionReason && (
                                                        <p className="text-xs text-red-500 mt-1 max-w-[150px] truncate" title={tool.rejectionReason}>
                                                            {tool.rejectionReason}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1 text-sm text-neutral-600">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium">{tool.averageRating?.toFixed(1) || "0.0"}</span>
                                                            <span className="text-yellow-400">★</span>
                                                            <span className="text-neutral-400">({tool.ratingCount || 0})</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {tool.featured ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                            Featured until {new Date(tool.featuredUntil).toLocaleDateString()}
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handlePromote(tool)}
                                                            disabled={tool.status !== 'approved'}
                                                            className={`text-sm font-medium ${tool.status === 'approved'
                                                                ? 'text-primary hover:text-primary-dark'
                                                                : 'text-neutral-400 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            Promote Tool
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <Link
                                                        to={`/tools/${tool._id}/analytics`}
                                                        className="text-neutral-400 hover:text-primary inline-block transition-colors"
                                                        title="Analytics"
                                                    >
                                                        <BarChart2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleEdit(tool)}
                                                        className="text-neutral-400 hover:text-neutral-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tool._id)}
                                                        className="text-neutral-400 hover:text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {tools.map((tool) => (
                                <div key={tool._id} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={tool.logo || "https://via.placeholder.com/40"}
                                                alt={tool.name}
                                                className="h-12 w-12 rounded-lg object-cover border border-neutral-200"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-neutral-900">{tool.name}</h3>
                                                <p className="text-sm text-neutral-500">{tool.category}</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(tool.status)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div>
                                            <p className="text-neutral-500 mb-1">Rating</p>
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-neutral-900">{tool.averageRating?.toFixed(1) || "0.0"}</span>
                                                <span className="text-yellow-400">★</span>
                                                <span className="text-neutral-400">({tool.ratingCount || 0})</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-neutral-500 mb-1">Monetization</p>
                                            {tool.featured ? (
                                                <span className="text-xs font-medium text-primary">
                                                    Featured
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handlePromote(tool)}
                                                    disabled={tool.status !== 'approved'}
                                                    className={`text-xs font-medium ${tool.status === 'approved'
                                                        ? 'text-primary'
                                                        : 'text-neutral-400'
                                                        }`}
                                                >
                                                    Promote
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                                        <Link
                                            to={`/tools/${tool._id}/analytics`}
                                            className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary"
                                        >
                                            <BarChart2 size={16} />
                                            Analytics
                                        </Link>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEdit(tool)}
                                                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tool._id)}
                                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {showPremiumModal && selectedTool && (
                <PremiumListingModal
                    tool={selectedTool}
                    onClose={() => setShowPremiumModal(false)}
                />
            )}

            {showEditModal && selectedTool && (
                <ToolEditModal
                    tool={selectedTool}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={() => {
                        fetchMyTools();
                        setShowEditModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default CreatorDashboard;
