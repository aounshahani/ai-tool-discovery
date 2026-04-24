import React, { useState, useEffect } from 'react';
import { getPendingTools, getAllTools, approveTool, rejectTool, deleteTool } from '../../api/adminApi';
import { Check, X, Trash2, ExternalLink } from 'lucide-react';

const ToolModeration = () => {
    const [tools, setTools] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadTools();
    }, [filter]);

    const loadTools = async () => {
        setLoading(true);
        try {
            const data = filter === 'pending'
                ? await getPendingTools()
                : await getAllTools({ status: filter !== 'all' ? filter : undefined });
            setTools(data.tools || []);
        } catch (error) {
            console.error('Error loading tools:', error);
            // alert(error.response?.data?.message || 'Error loading tools');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (toolId, action, reason = '') => {
        try {
            if (action === 'approved') {
                if (confirm('Approve this tool?')) {
                    await approveTool(toolId);
                    alert('Tool approved successfully!');
                } else return;
            } else if (action === 'rejected') {
                await rejectTool(toolId, reason);
                alert('Tool rejected');
            }
            loadTools();
        } catch (error) {
            alert('Error processing tool');
        }
    };

    const handleDelete = async (toolId) => {
        if (confirm('Are you sure you want to delete this tool? This cannot be undone.')) {
            try {
                await deleteTool(toolId);
                loadTools();
                alert('Tool deleted');
            } catch (error) {
                alert('Error deleting tool');
            }
        }
    };

    const pendingTools = tools; // For compatibility with the previous variable name

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-bold text-card-foreground">Tool Moderation</h2>
                <div className="flex gap-2">
                    {['pending', 'approved', 'rejected', 'all'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-lg text-sm capitalize transition-all ${filter === f
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading tools...</div>
            ) : tools.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No tools found.</div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tool</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Submitted By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {tools.map((tool) => (
                                    <tr key={tool._id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={tool.logo || "https://via.placeholder.com/40"}
                                                    alt={tool.name}
                                                    className="h-10 w-10 rounded-lg object-cover mr-3 border border-border"
                                                />
                                                <div>
                                                    <div className="font-medium text-foreground">{tool.name}</div>
                                                    <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                                        Visit Website <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {tool.userId?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {new Date(tool.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {tool.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(tool._id, 'approved')}
                                                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectModal(tool._id)}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(tool._id)}
                                                className="text-neutral-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
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

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-border">
                        {tools.map((tool) => (
                            <div key={tool._id} className="p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={tool.logo || "https://via.placeholder.com/40"}
                                        alt={tool.name}
                                        className="h-12 w-12 rounded-lg object-cover border border-border"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-foreground">{tool.name}</h3>
                                        <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                            Visit Website <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>By: {tool.userId?.name || 'Unknown'}</span>
                                    <span>{new Date(tool.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tool.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            tool.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {tool.status}
                                    </span>

                                    <div className="flex gap-2">
                                        {tool.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(tool._id, 'approved')}
                                                    className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setRejectModal(tool._id)}
                                                    className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        )}
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

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setRejectModal(null)}>
                    <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4 text-card-foreground">Reject Tool</h2>
                        <textarea
                            placeholder="Reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows="4"
                            className="w-full p-3 border border-input rounded-lg mb-4 bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setRejectModal(null)}
                                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (rejectReason) {
                                        handleAction(rejectModal, 'rejected', rejectReason);
                                        setRejectModal(null);
                                        setRejectReason('');
                                    } else {
                                        alert('Please provide a reason');
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Reject Tool
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolModeration;
