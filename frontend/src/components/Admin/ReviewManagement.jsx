import React, { useState, useEffect } from 'react';
import { getAllReviews, getReportedReviews, updateReviewStatus, bulkDeleteReviews } from '../../api/adminApi';
import { Star, Check, X, Trash2, AlertTriangle } from 'lucide-react';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        loadReviews();
    }, [filter]);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const data = filter === 'reported'
                ? await getReportedReviews()
                : await getAllReviews({ status: filter === 'all' ? undefined : filter });
            setReviews(data.data || []);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (reviewId, status) => {
        try {
            await updateReviewStatus(reviewId, status);
            loadReviews();
            // alert(`Review ${status}`);
        } catch (error) {
            alert('Error updating review');
        }
    };

    const handleBulkDelete = async () => {
        if (selected.length === 0) return alert('No reviews selected');
        if (confirm(`Delete ${selected.length} selected reviews?`)) {
            try {
                await bulkDeleteReviews(selected);
                setSelected([]);
                loadReviews();
                alert('Reviews deleted');
            } catch (error) {
                alert('Error deleting reviews');
            }
        }
    };

    const toggleSelection = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    return (
        <div className="w-full space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h1 className="text-card-foreground text-2xl font-bold mb-2 flex items-center gap-2">
                    <Star className="text-yellow-500 fill-yellow-500" /> Review Management
                </h1>
                <p className="text-muted-foreground">Moderate reviews and handle reports</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                    {['pending', 'approved', 'reported', 'all'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize font-medium transition-colors ${filter === f
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-card border border-border text-muted-foreground hover:bg-secondary'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                {selected.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Delete Selected ({selected.length})
                    </button>
                )}
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No reviews found</div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/50 border-b border-border">
                                    <tr>
                                        <th className="p-4 w-10">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => setSelected(e.target.checked ? reviews.map(r => r._id) : [])}
                                                checked={selected.length === reviews.length && reviews.length > 0}
                                                className="rounded border-input text-primary focus:ring-primary"
                                            />
                                        </th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Tool</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">User</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Rating</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Comment</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {reviews.map((review) => (
                                        <tr key={review._id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(review._id)}
                                                    onChange={() => toggleSelection(review._id)}
                                                    className="rounded border-input text-primary focus:ring-primary"
                                                />
                                            </td>
                                            <td className="p-4 font-medium text-card-foreground">{review.tool?.name || 'Unknown'}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{review.user?.name || 'Unknown'}</td>
                                            <td className="p-4">
                                                <div className="flex text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-muted-foreground/30"} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 max-w-xs truncate text-sm text-muted-foreground" title={review.comment}>
                                                {review.comment}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${review.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {review.status}
                                                    </span>
                                                    {review.reported && (
                                                        <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium w-fit">
                                                            <AlertTriangle size={10} /> Reported
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {review.status !== 'approved' && (
                                                        <button
                                                            onClick={() => handleStatusChange(review._id, 'approved')}
                                                            className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                    {review.status !== 'rejected' && (
                                                        <button
                                                            onClick={() => handleStatusChange(review._id, 'rejected')}
                                                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-border">
                            {reviews.map((review) => (
                                <div key={review._id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(review._id)}
                                                onChange={() => toggleSelection(review._id)}
                                                className="rounded border-input text-primary focus:ring-primary"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-card-foreground">{review.tool?.name || 'Unknown'}</h3>
                                                <p className="text-xs text-muted-foreground">by {review.user?.name || 'Unknown'}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-muted-foreground/30"} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-secondary/30 p-3 rounded-lg text-sm text-card-foreground">
                                        "{review.comment}"
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${review.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {review.status}
                                            </span>
                                            {review.reported && (
                                                <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                                                    <AlertTriangle size={10} /> Reported
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {review.status !== 'approved' && (
                                                <button
                                                    onClick={() => handleStatusChange(review._id, 'approved')}
                                                    className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            {review.status !== 'rejected' && (
                                                <button
                                                    onClick={() => handleStatusChange(review._id, 'rejected')}
                                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
