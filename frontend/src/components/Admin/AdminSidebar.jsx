import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    BarChart2,
    Shield,
    Users,
    Folder,
    Star,
    DollarSign,
    Flag,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react';

const AdminSidebar = ({ collapsed, onToggle }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: <BarChart2 size={20} />, label: 'Analytics', exact: true },
        { path: '/admin/tools', icon: <Shield size={20} />, label: 'Tool Moderation' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'User Management' },
        { path: '/admin/categories', icon: <Folder size={20} />, label: 'Categories' },
        { path: '/admin/reviews', icon: <Star size={20} />, label: 'Reviews' },
        { path: '/admin/monetization', icon: <DollarSign size={20} />, label: 'Monetization' },
        { path: '/admin/reports', icon: <Flag size={20} />, label: 'Reports' }
    ];

    const isActive = (item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${!collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onToggle}
            />

            <aside className={`fixed left-0 top-0 h-screen bg-card border-r border-border shadow-2xl flex flex-col transition-all duration-300 z-50 
                ${collapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64 md:w-72'}
            `}>
                <div className="p-6 border-b border-border flex items-center justify-between h-16 md:h-auto">
                    <h2 className={`text-card-foreground font-bold text-xl transition-all whitespace-nowrap overflow-hidden ${collapsed ? 'md:opacity-0 md:w-0' : 'opacity-100'}`}>
                        Admin Panel
                    </h2>

                    {/* Desktop Toggle Button */}
                    <button
                        onClick={onToggle}
                        className="hidden md:flex bg-secondary hover:bg-secondary/80 text-secondary-foreground w-8 h-8 rounded-lg items-center justify-center transition-all cursor-pointer"
                        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onToggle}
                        className="md:hidden text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 768 && onToggle()} // Close on mobile click
                            className={`flex items-center gap-4 p-3 rounded-lg transition-colors group 
                                ${isActive(item)
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'} 
                                ${collapsed ? 'md:justify-center' : ''}`
                            }
                            title={collapsed ? item.label : ''}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span className={`whitespace-nowrap transition-all overflow-hidden ${collapsed ? 'md:opacity-0 md:w-0' : 'opacity-100'}`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default AdminSidebar;
