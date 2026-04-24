import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Star } from 'lucide-react';

const ToolRecommendations = ({ category, currentToolId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get(`/tools/recommendations`, {
                    params: { category, excludeId: currentToolId }
                });
                setRecommendations(res.data);
            } catch (err) {
                console.error("Failed to fetch recommendations", err);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchRecommendations();
        }
    }, [category, currentToolId]);

    if (loading || recommendations.length === 0) return null;

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-card-foreground mb-6">You Might Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {recommendations.map((tool) => (
                    <Link
                        key={tool._id}
                        to={`/tools/${tool._id}`}
                        className="group bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all hover:border-primary/50"
                    >
                        <div className="p-4">
                            <div className="flex items-center mb-3">
                                <img
                                    src={tool.logo || "https://via.placeholder.com/40"}
                                    alt={tool.name}
                                    className="w-10 h-10 rounded-lg object-cover mr-3 border border-border"
                                />
                                <div>
                                    <h4 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                                        {tool.name}
                                    </h4>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Star size={12} className="text-yellow-400 fill-current mr-1" />
                                        {tool.averageRating?.toFixed(1) || "New"}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {tool.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {tool.useCases?.slice(0, 2).map((useCase, i) => (
                                    <span key={i} className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                                        {useCase}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ToolRecommendations;
