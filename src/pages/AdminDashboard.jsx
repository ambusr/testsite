import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentSession, logoutUser, getAllUsers, addUser, deleteUser, resetUserPassword, updateUser } from '../utils/mockDb';
import {
    Users,
    UserPlus,
    Trash2,
    RefreshCcw,
    Edit2,
    LogOut,
    LayoutDashboard,
    Search,
    X,
    Check
} from 'lucide-react';

export default function AdminDashboard() {
    const [session, setSession] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [searchQuery, setSearchQuery] = useState('');

    // Form state for adding/editing
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentUser, setCurrentUser] = useState(null);
    const [formEmail, setFormEmail] = useState('');
    const [formName, setFormName] = useState('');
    const [formRole, setFormRole] = useState('student');
    const [formSubjects, setFormSubjects] = useState('');
    const [formError, setFormError] = useState('');

    // Confirmation modal state
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const userSession = getCurrentSession();
        if (!userSession || userSession.role !== 'admin') {
            navigate('/login');
            return;
        }
        setSession(userSession);
        loadUsers();
    }, [navigate]);

    const loadUsers = async () => {
        setLoading(true);
        const data = await getAllUsers();
        // Filter out admin themselves from management list for safety, or keep? 
        // User said "review teachers & students", so filtering admins.
        setUsers(data.filter(u => u.role !== 'admin'));
        setLoading(false);
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleAddClick = () => {
        setModalMode('add');
        setFormEmail('');
        setFormName('');
        setFormRole('student');
        setFormSubjects('');
        setFormError('');
        setIsModalOpen(true);
    };

    const handleEditClick = (user) => {
        setModalMode('edit');
        setCurrentUser(user);
        setFormEmail(user.email);
        setFormName(user.name);
        setFormRole(user.role);
        setFormSubjects(user.subjects ? user.subjects.join(', ') : '');
        setFormError('');
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formEmail || !formName) {
            setFormError('Please fill in all fields.');
            return;
        }

        if (modalMode === 'add') {
            // Check if email already exists
            const existing = users.find(u => u.email === formEmail);
            if (existing) {
                setFormError('Email already registered.');
                return;
            }
            const subjectsArray = formSubjects.split(',').map(s => s.trim()).filter(s => s !== '');
            await addUser(formEmail, formRole, formName, subjectsArray);
        } else {
            const subjectsArray = formSubjects.split(',').map(s => s.trim()).filter(s => s !== '');
            await updateUser(currentUser.id, { email: formEmail, role: formRole, name: formName, subjects: subjectsArray });
        }

        setIsModalOpen(false);
        loadUsers();
    };

    const handleDelete = (userId) => {
        setConfirmTitle('Delete User');
        setConfirmMessage('Are you sure you want to delete this user? This action cannot be undone.');
        setOnConfirm(() => async () => {
            await deleteUser(userId);
            loadUsers();
            setIsConfirmOpen(false);
        });
        setIsConfirmOpen(true);
    };

    const handleResetPassword = (userId) => {
        setConfirmTitle('Reset Password');
        setConfirmMessage('This will force the user to set a new password on their next login. Continue?');
        setOnConfirm(() => async () => {
            await resetUserPassword(userId);
            setIsConfirmOpen(false);
            // Optional: add a toast or non-blocking notification instead of alert
        });
        setIsConfirmOpen(true);
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && users.length === 0) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'white' }}>
                <div className="animate-pulse">Loading Admin Panel...</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'white' }}>
            {/* Sidebar / Topbar */}
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <aside style={{ width: '280px', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid var(--glass-border)', padding: '2rem 1rem' }}>
                    <div style={{ padding: '0 1rem', marginBottom: '3rem' }}>
                        <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Edufy Admin</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>System Management</p>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            onClick={() => setActiveTab('users')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                                background: activeTab === 'users' ? 'rgba(99,102,241,0.1)' : 'transparent',
                                color: activeTab === 'users' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                transition: 'all 0.3s ease', fontWeight: activeTab === 'users' ? '600' : '400'
                            }}
                        >
                            <Users size={20} /> User Management
                        </button>
                        <button
                            disabled
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                borderRadius: '0.75rem', border: 'none', cursor: 'not-allowed',
                                background: 'transparent', color: 'rgba(255,255,255,0.1)',
                                opacity: 0.5
                            }}
                        >
                            <LayoutDashboard size={20} /> Analytics (Soon)
                        </button>
                    </nav>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </aside>

                <main style={{ flex: 1, padding: '3rem' }}>
                    {activeTab === 'users' && (
                        <div className="animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Management</h1>
                                    <p style={{ color: 'var(--text-secondary)' }}>Manage your students and teachers from here.</p>
                                </div>
                                <button className="btn" onClick={handleAddClick} style={{ background: 'var(--primary-color)', color: 'white' }}>
                                    <UserPlus size={18} /> Add New User
                                </button>
                            </div>

                            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ position: 'relative', width: '300px' }}>
                                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                        <input
                                            type="text"
                                            placeholder="Search by name or email..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        Total Users: {filteredUsers.length}
                                    </div>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                                        <tr>
                                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>NAME</th>
                                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>EMAIL</th>
                                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ROLE</th>
                                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>SUBJECTS</th>
                                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>STATUS</th>
                                            <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'right' }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s ease' }}>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>{user.name}</td>
                                                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '600',
                                                        background: user.role === 'student' ? 'rgba(99,102,241,0.1)' : 'rgba(139,92,246,0.1)',
                                                        color: user.role === 'student' ? 'var(--primary-color)' : 'var(--secondary-color)'
                                                    }}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                                        {user.subjects && user.subjects.map((sub, i) => (
                                                            <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{sub}</span>
                                                        ))}
                                                        {(!user.subjects || user.subjects.length === 0) && <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>None</span>}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    {user.password ? (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.875rem' }}>
                                                            <Check size={14} /> Active
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: '#f59e0b', fontSize: '0.875rem' }}>Pending Setup</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => handleResetPassword(user.id)} title="Reset Password" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                                            <RefreshCcw size={16} />
                                                        </button>
                                                        <button onClick={() => handleEditClick(user)} title="Edit User" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(user.id)} title="Delete User" style={{ padding: '0.5rem', background: 'rgba(244,63,94,0.1)', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', color: '#f87171' }}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="glass-panel animate-scale-in" style={{ width: '400px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>{modalMode === 'add' ? 'Add User' : 'Edit User'}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="Enter user's full name"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email Address</label>
                                <input
                                    type="email"
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
                                    placeholder="Enter email"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Role</label>
                                <select
                                    value={formRole}
                                    onChange={(e) => setFormRole(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Subjects (Comma separated)</label>
                                <input
                                    type="text"
                                    value={formSubjects}
                                    onChange={(e) => setFormSubjects(e.target.value)}
                                    placeholder="e.g. Mathematics, Physics, English"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                                />
                            </div>

                            {formError && <p style={{ color: '#f87171', fontSize: '0.875rem' }}>{formError}</p>}

                            <button type="submit" className="btn" style={{ background: 'var(--primary-color)', color: 'white', width: '100%', marginTop: '1rem' }}>
                                {modalMode === 'add' ? 'Create User' : 'Update User'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Confirmation Modal */}
            {isConfirmOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110 }}>
                    <div className="glass-panel animate-scale-in" style={{ width: '400px', padding: '2rem', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(244,63,94,0.1)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <Trash2 size={30} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{confirmTitle}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{confirmMessage}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setIsConfirmOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            <button
                                id="confirm-action-btn"
                                onClick={onConfirm}
                                className="btn"
                                style={{ flex: 1, background: confirmTitle === 'Delete User' ? '#f43f5e' : 'var(--primary-color)', color: 'white' }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
