import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { getUsers, updateUserLevel, deleteUser } from '../../services/authService';

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', department: '', password: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setEditForm({ name: user.name, email: user.email, department: user.department, password: '' });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            // Only include password if it's not empty
            const updateData: any = {
                name: editForm.name,
                email: editForm.email,
                department: editForm.department
            };
            if (editForm.password) updateData.password = editForm.password;

            await import('../../services/authService').then(m => m.updateUserDetails(editingUser.id, updateData));

            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...updateData } : u));
            setEditingUser(null);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleToggleLevel = async (user: User) => {
        const newLevel = user.userLevel === 1 ? 2 : 1;
        try {
            await updateUserLevel(user.id, newLevel);
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, userLevel: newLevel } : u));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-8 text-slate-400">Loading users...</div>;
    if (error) return <div className="p-8 text-rose-400">Error: {error}</div>;

    return (
        <div className="p-8 animate-in fade-in duration-500 relative">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-100 mb-2">User Management</h1>
                <p className="text-slate-400 text-sm">Manage system permissions and users.</p>
            </div>

            <div className="glass rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-white/5">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#fd7912]">User</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#fd7912]">Department</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#fd7912]">Level</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#fd7912] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-200">{user.name}</span>
                                            <span className="text-[11px] text-slate-500">{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md">
                                        {user.department}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${user.userLevel === 1
                                        ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
                                        : 'text-slate-500 bg-slate-500/10 border border-slate-500/20'
                                        }`}>
                                        {user.userLevel === 1 ? 'Admin' : 'User'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-blue-400 transition-all"
                                            title="Edit User"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleToggleLevel(user)}
                                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-emerald-400 transition-all"
                                            title={user.userLevel === 1 ? "Demote to User" : "Promote to Admin"}
                                        >
                                            <i className={`fas ${user.userLevel === 1 ? 'fa-user-minus' : 'fa-user-shield'}`}></i>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-all shadow-none border-none"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="glass w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10 relative">
                        <button
                            onClick={() => setEditingUser(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        <h2 className="text-xl font-black text-white mb-6 flex items-center">
                            <i className="fas fa-user-edit mr-3 text-[#fd7912]"></i> Edit User
                        </h2>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#fd7912]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#fd7912]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Department</label>
                                <select
                                    value={editForm.department}
                                    onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#fd7912] appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Select Department</option>
                                    {Array.from(new Set(users.map(u => u.department))).map(dept => (
                                        <option key={dept} value={dept} className="bg-slate-900 text-white">{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">New Password (Optional)</label>
                                <input
                                    type="password"
                                    value={editForm.password}
                                    onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                    placeholder="Leave blank to keep current"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#fd7912]"
                                />
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#fd7912] hover:bg-[#fd7912]/80 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-[#fd7912]/20"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

