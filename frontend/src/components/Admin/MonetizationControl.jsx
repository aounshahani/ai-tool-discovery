import React, { useState, useEffect } from 'react';
import { getFeaturedTools, setFeaturedTool, removeFeaturedTool, getSponsoredTools, setSponsoredTool } from '../../api/adminApi';
import { DollarSign, Award, Calendar, Trash2, Plus } from 'lucide-react';

const MonetizationControl = () => {
    const [featuredTools, setFeaturedTools] = useState([]);
    const [sponsoredTools, setSponsoredTools] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [featured, sponsored] = await Promise.all([getFeaturedTools(), getSponsoredTools()]);
            setFeaturedTools(featured.featuredTools || []);
            setSponsoredTools(sponsored.sponsoredTools || []);
        } catch (error) {
            console.error('Error loading monetization data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetFeatured = async () => {
        const toolId = prompt('Enter Tool ID to feature:');
        const date = prompt('Feature until (YYYY-MM-DD) or leave empty:');
        if (toolId) {
            try {
                await setFeaturedTool(toolId, date || null);
                loadData();
                alert('Tool featured');
            } catch (error) {
                alert('Error featuring tool');
            }
        }
    };

    const handleSetSponsored = async () => {
        const toolId = prompt('Enter Tool ID:');
        const sponsor = prompt('Sponsor name:');
        if (toolId && sponsor) {
            try {
                await setSponsoredTool(toolId, sponsor);
                loadData();
            } catch (error) {
                alert('Error adding sponsored tool');
            }
        }
    }

    return (
        <div className="w-full space-y-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h1 className="text-card-foreground text-2xl font-bold mb-2 flex items-center gap-2">
                    <DollarSign className="text-green-600" /> Monetization Control
                </h1>
                <p className="text-muted-foreground">Manage featured placements and sponsored content</p>
            </div>

            {/* Featured Tools Section */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                        <Award className="text-yellow-500" size={20} /> Featured Tools
                    </h2>
                    <button
                        onClick={handleSetFeatured}
                        className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <Plus size={16} /> Add Featured Tool
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : featuredTools.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No featured tools</div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/50 border-b border-border">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Tool</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Category</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Featured Until</th>
                                        <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {featuredTools.map((tool) => (
                                        <tr key={tool._id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {tool.logo && <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-lg object-cover border border-border" />}
                                                    <span className="font-semibold text-card-foreground">{tool.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground">{tool.category || 'N/A'}</td>
                                            <td className="p-4 text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {tool.featuredUntil ? new Date(tool.featuredUntil).toLocaleDateString() : 'Indefinite'}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={async () => { await removeFeaturedTool(tool._id); loadData(); }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove"
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
                            {featuredTools.map((tool) => (
                                <div key={tool._id} className="p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        {tool.logo && <img src={tool.logo} alt={tool.name} className="w-12 h-12 rounded-lg object-cover border border-border" />}
                                        <div>
                                            <h3 className="font-semibold text-card-foreground">{tool.name}</h3>
                                            <p className="text-sm text-muted-foreground">{tool.category || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar size={14} />
                                            <span>Until: {tool.featuredUntil ? new Date(tool.featuredUntil).toLocaleDateString() : 'Indefinite'}</span>
                                        </div>
                                        <button
                                            onClick={async () => { await removeFeaturedTool(tool._id); loadData(); }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Sponsored Tools Section */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                        <DollarSign className="text-green-600" size={20} /> Sponsored Tools
                    </h2>
                    <button
                        onClick={handleSetSponsored}
                        className="w-full sm:w-auto px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <Plus size={16} /> Add Sponsored Tool
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : sponsoredTools.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No sponsored tools</div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary/50 border-b border-border">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Tool</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Category</th>
                                        <th className="text-left p-4 font-semibold text-muted-foreground">Sponsored By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {sponsoredTools.map((tool) => (
                                        <tr key={tool._id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {tool.logo && <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-lg object-cover border border-border" />}
                                                    <span className="font-semibold text-card-foreground">{tool.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground">{tool.category || 'N/A'}</td>
                                            <td className="p-4 font-medium text-card-foreground">{tool.sponsoredBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-border">
                            {sponsoredTools.map((tool) => (
                                <div key={tool._id} className="p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        {tool.logo && <img src={tool.logo} alt={tool.name} className="w-12 h-12 rounded-lg object-cover border border-border" />}
                                        <div>
                                            <h3 className="font-semibold text-card-foreground">{tool.name}</h3>
                                            <p className="text-sm text-muted-foreground">{tool.category || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Sponsored by: </span>
                                        <span className="font-medium text-card-foreground">{tool.sponsoredBy}</span>
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

export default MonetizationControl;
