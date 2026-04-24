import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import ToolModeration from '../components/Admin/ToolModeration';
import UserManagement from '../components/Admin/UserManagement';
import ReviewManagement from '../components/Admin/ReviewManagement';
import AnalyticsDashboard from '../components/Admin/AnalyticsDashboard';
import MonetizationControl from '../components/Admin/MonetizationControl';
import ReportManagement from '../components/Admin/ReportManagement';
import CategoryManagement from '../components/Admin/CategoryManagement';
import { Menu, X } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    // Initialize sidebar state based on screen width
    // Mobile: Default collapsed (true)
    // Desktop: Default expanded (false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarCollapsed(true);
            } else {
                setSidebarCollapsed(false);
            }
        };

        // Optional: Add event listener if we want dynamic resizing behavior
        // window.addEventListener('resize', handleResize);
        // return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check if user is admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center px-4 justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-2 text-foreground hover:bg-secondary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Toggle Sidebar"
                    >
                        {sidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
                    </button>
                    <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
                </div>
            </div>

            <AdminSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <main
                className={`flex-1 transition-all duration-300 p-4 md:p-8 mt-16 md:mt-0 
                ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'} 
                w-full overflow-x-hidden`}
            >
                <Routes>
                    <Route index element={<AnalyticsDashboard />} />
                    <Route path="tools" element={<ToolModeration />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="categories" element={<CategoryManagement />} />
                    <Route path="reviews" element={<ReviewManagement />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="monetization" element={<MonetizationControl />} />
                    <Route path="reports" element={<ReportManagement />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminDashboard;
