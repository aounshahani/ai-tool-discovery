import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { ArrowLeft, Eye, MousePointer, Star, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ToolAnalytics = () => {
    const { toolId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [toolId]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`/tools/${toolId}/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;
    if (!data) return <div className="p-8 text-center text-muted-foreground">Analytics not found</div>;

    const { tool, analytics, reviews } = data;

    // Process events for summary cards
    const impressions = analytics.events.find(e => e._id === 'impression')?.count || 0;
    const clicks = analytics.events.find(e => e._id === 'click')?.count || 0;
    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : 0;

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <Link to="/creator/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={tool.logo || "https://via.placeholder.com/48"}
                            alt={tool.name}
                            className="w-16 h-16 rounded-xl object-cover border border-border"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-card-foreground">{tool.name} Analytics</h1>
                            <p className="text-muted-foreground">Performance overview for the last 30 days</p>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Total Views</h3>
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Eye size={20} className="text-blue-500" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-card-foreground">{impressions}</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Website Clicks</h3>
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <MousePointer size={20} className="text-green-500" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-card-foreground">{clicks}</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Click-Through Rate</h3>
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <TrendingUp size={20} className="text-purple-500" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-card-foreground">{ctr}%</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Avg Rating</h3>
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                <Star size={20} className="text-yellow-500" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-card-foreground">
                            {tool.averageRating?.toFixed(1) || "0.0"}
                            <span className="text-sm text-muted-foreground font-normal ml-2">
                                ({reviews.length} reviews)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="text-lg font-bold text-card-foreground mb-6">Views Over Time</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.dailyViews}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="_id"
                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    stroke="hsl(var(--muted-foreground))"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        color: 'hsl(var(--card-foreground))',
                                        borderRadius: '0.5rem'
                                    }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reviews */}
                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h3 className="text-lg font-bold text-card-foreground">Recent Reviews</h3>
                    </div>
                    {reviews.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No reviews yet</div>
                    ) : (
                        <div className="divide-y divide-border">
                            {reviews.map((review) => (
                                <div key={review._id} className="p-6 hover:bg-secondary/10 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium text-card-foreground">{review.user?.name || "Anonymous"}</div>
                                            <span className="text-muted-foreground">•</span>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-yellow-500/10 px-2 py-1 rounded-lg">
                                            <Star size={14} className="text-yellow-500 fill-current mr-1" />
                                            <span className="font-medium text-yellow-700 dark:text-yellow-500">{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolAnalytics;
