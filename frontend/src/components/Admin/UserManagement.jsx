import React, { useState, useEffect } from 'react';
import { getAllUsers, banUser, unbanUser, verifyCreator, unverifyCreator } from '../../api/adminApi';
import { Search } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [banModal, setBanModal] = useState(null);
    const [banReason, setBanReason] = useState('');
    const [detailModal, setDetailModal] = useState(null);

    // Filtered users based on search and filter state
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' ? true :
            filter === 'isBanned' ? user.isBanned :
                filter === 'isVerified' ? user.isVerified : true;
        return matchesSearch && matchesFilter;
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers({});
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId, isBanned) => {
        if (isBanned) {
            if (confirm('Unban this user?')) {
                await unbanUser(userId);
                loadUsers();
            }
        } else {
            setBanModal(userId);
        }
    };

    const confirmBan = async () => {
        if (!banReason.trim()) return alert('Please provide a ban reason');
        try {
            await banUser(banModal, banReason);
            setBanModal(null);
            setBanReason('');
            loadUsers();
            alert('User banned');
        } catch (error) {
            alert(error.response?.data?.message || 'Error banning user');
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-bold text-card-foreground">User Management</h2>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading users...</div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-foreground">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-secondary text-secondary-foreground'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.isBanned ? (
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Banned
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleBanUser(user._id, user.isBanned)}
                                                className={`text-sm font-medium ${user.isBanned ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                                            >
                                                {user.isBanned ? 'Unban' : 'Ban'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-border">
                        {filteredUsers.map((user) => (
                            <div key={user._id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-secondary text-secondary-foreground'}`}>
                                        {user.role}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${user.isBanned ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <span className="text-muted-foreground">{user.isBanned ? 'Banned' : 'Active'}</span>
                                    </div>
                                    <span className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={() => handleBanUser(user._id, user.isBanned)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${user.isBanned
                                            ? 'border-green-200 text-green-700 hover:bg-green-50'
                                            : 'border-red-200 text-red-700 hover:bg-red-50'}`}
                                    >
                                        {user.isBanned ? 'Unban User' : 'Ban User'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {banModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setBanModal(null)}>
                    <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4 text-card-foreground">Ban User</h2>
                        <textarea
                            placeholder="Reason for ban..."
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            rows="4"
                            className="w-full p-3 border border-input rounded-lg mb-4 bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setBanModal(null)}
                                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmBan}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Ban User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
