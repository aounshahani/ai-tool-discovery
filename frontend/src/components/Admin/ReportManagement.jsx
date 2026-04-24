import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Flag, AlertTriangle, Calendar } from 'lucide-react';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get('/admin/reports');
            setReports(res.data.reports || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch reports');
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading reports...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="w-full space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-card-foreground mb-2 flex items-center gap-2">
                    <Flag className="text-red-500" /> User Reports
                </h2>
                <p className="text-muted-foreground">Review and manage content reported by users</p>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {reports.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No reports found.</div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-secondary/50 border-b border-border">
                                    <tr>
                                        <th className="p-4 font-semibold text-muted-foreground">Tool</th>
                                        <th className="p-4 font-semibold text-muted-foreground">Reporter</th>
                                        <th className="p-4 font-semibold text-muted-foreground">Reason</th>
                                        <th className="p-4 font-semibold text-muted-foreground">Description</th>
                                        <th className="p-4 font-semibold text-muted-foreground">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {reports.map((report) => (
                                        <tr key={report._id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="p-4 font-medium text-primary">
                                                {report.toolId?.name || 'Unknown Tool'}
                                            </td>
                                            <td className="p-4 text-card-foreground">
                                                <div className="font-medium">{report.userId?.name || 'Anonymous'}</div>
                                                <div className="text-xs text-muted-foreground">{report.userId?.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1
                                                    ${report.reason === 'broken_link' ? 'bg-yellow-100 text-yellow-800' :
                                                        report.reason === 'inappropriate_content' ? 'bg-red-100 text-red-800' :
                                                            'bg-secondary text-secondary-foreground'}`}>
                                                    <AlertTriangle size={10} />
                                                    {report.reason.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4 text-muted-foreground max-w-xs truncate" title={report.description}>
                                                {report.description}
                                            </td>
                                            <td className="p-4 text-muted-foreground text-sm">
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-border">
                            {reports.map((report) => (
                                <div key={report._id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-primary">{report.toolId?.name || 'Unknown Tool'}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1
                                            ${report.reason === 'broken_link' ? 'bg-yellow-100 text-yellow-800' :
                                                report.reason === 'inappropriate_content' ? 'bg-red-100 text-red-800' :
                                                    'bg-secondary text-secondary-foreground'}`}>
                                            <AlertTriangle size={10} />
                                            {report.reason.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="text-sm">
                                        <div className="font-medium text-card-foreground">{report.userId?.name || 'Anonymous'}</div>
                                        <div className="text-xs text-muted-foreground">{report.userId?.email}</div>
                                    </div>

                                    <div className="bg-secondary/30 p-3 rounded-lg text-sm text-card-foreground">
                                        {report.description}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                                        <Calendar size={12} />
                                        {new Date(report.createdAt).toLocaleDateString()}
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

export default ReportManagement;
