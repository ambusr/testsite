import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentSession, logoutUser, getTeacherClasses } from '../utils/mockDb';
import { Calendar, Clock, BookOpen, Users, LogOut, Layout } from 'lucide-react';

export default function TeacherDashboard() {
    const [session, setSession] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userSession = getCurrentSession();
        if (!userSession || userSession.role !== 'teacher') {
            navigate('/login');
            return;
        }
        setSession(userSession);

        const fetchSchedule = async () => {
            const data = await getTeacherClasses(userSession.id);
            setSchedule(data);
            setLoading(false);
        };

        fetchSchedule();
    }, [navigate]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'white' }}>
                <div className="animate-pulse">Loading Teacher Portal...</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'white', padding: '2rem' }}>
            {/* Header */}
            <header style={{ maxWidth: '1200px', margin: '0 auto 3rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="text-gradient-secondary" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Teacher Portal</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <span style={{ color: 'white', fontWeight: 'bold' }}>{session?.name}</span></p>
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(139,92,246,0.1)', borderRadius: '0.5rem', color: 'var(--secondary-color)' }}>
                        <Calendar size={20} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem' }}>Your Teaching Schedule</h2>
                </div>

                {schedule.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <Layout size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No classes scheduled for this week.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {schedule.map((item) => (
                            <div key={item.id} className="glass-panel animate-fade-in" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--secondary-color)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {item.day}
                                    </span>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {item.date}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{item.subject}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
                                        <Clock size={16} />
                                        <span>{item.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
                                        <Users size={16} />
                                        <span>Student: {item.studentName}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
