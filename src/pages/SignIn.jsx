import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByEmailAndRole, updateUserPassword, loginUser } from '../utils/mockDb';
import { Mail, Lock, User, GraduationCap, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function SignIn() {
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [step, setStep] = useState('email'); // 'email', 'password', 'create-password', 'signup'
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [subjects, setSubjects] = useState('');
    const [error, setError] = useState('');
    const [foundUser, setFoundUser] = useState(null);

    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email.');
            return;
        }

        const user = await getUserByEmailAndRole(email, role);

        if (isSignUp) {
            if (user) {
                setError(`Email already registered for a ${role}.`);
                return;
            }
            setStep('signup');
            return;
        }

        if (!user) {
            setError(`Email not registered for a ${role}. Please contact the Admin.`);
            return;
        }

        setFoundUser(user);
        if (user.password === null) {
            setStep('create-password');
        } else {
            setStep('password');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== foundUser.password) {
            setError('Invalid password.');
            return;
        }

        // Success login
        loginUser(foundUser);
        if (foundUser.role === 'admin') {
            navigate('/admin-portal');
        } else {
            navigate(role === 'student' ? '/student-portal' : '/teacher-portal');
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !subjects || !newPassword || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const subjectsArray = subjects.split(',').map(s => s.trim()).filter(s => s !== '');
        const newUser = await addUser(email, role, name, subjectsArray);
        await updateUserPassword(newUser.id, newPassword);

        // Auto login after signup
        const loggedUser = { ...newUser, password: newPassword };
        loginUser(loggedUser);
        navigate(role === 'student' ? '/student-portal' : '/teacher-portal');
    };

    const resetFlow = () => {
        setStep('email');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setName('');
        setSubjects('');
        setError('');
        setFoundUser(null);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '2rem' }}>
            {/* Background ambient elements */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'var(--primary-color)', borderRadius: '50%', filter: 'blur(150px)', opacity: '0.2', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'var(--secondary-color)', borderRadius: '50%', filter: 'blur(150px)', opacity: '0.2', zIndex: 0 }}></div>

            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>
                {/* Back to Home */}
                <button
                    onClick={() => navigate('/')}
                    style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', transition: 'color 0.3s ease' }}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/Logo.png" alt="Edufy" style={{ height: '40px', marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue to Edufy</p>
                </div>

                {/* Role Selection Toggle */}
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '0.75rem', padding: '0.25rem', marginBottom: '2rem' }}>
                    <button
                        type="button"
                        onClick={() => { setRole('student'); resetFlow(); }}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '600', transition: 'all 0.3s ease', background: role === 'student' ? 'var(--primary-color)' : 'transparent', color: role === 'student' ? 'white' : 'var(--text-secondary)', boxShadow: role === 'student' ? 'var(--shadow-sm)' : 'none' }}
                    >
                        <GraduationCap size={18} /> Student
                    </button>
                    <button
                        type="button"
                        onClick={() => { setRole('teacher'); resetFlow(); }}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '600', transition: 'all 0.3s ease', background: role === 'teacher' ? 'var(--secondary-color)' : 'transparent', color: role === 'teacher' ? 'white' : 'var(--text-secondary)', boxShadow: role === 'teacher' ? 'var(--shadow-sm)' : 'none' }}
                    >
                        <User size={18} /> Teacher
                    </button>
                </div>

                {error && (
                    <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                {/* Step 1: Email Input */}
                {step === 'email' && (
                    <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={role === 'student' ? "Enter your student email" : "Enter email or 'Admin'"}
                                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s ease' }}
                                    onFocus={(e) => e.target.style.borderColor = role === 'student' ? 'var(--primary-color)' : 'var(--secondary-color)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn" style={{ width: '100%', background: role === 'student' ? 'var(--primary-color)' : 'var(--secondary-color)', color: 'white', marginTop: '0.5rem' }}>
                            Continue <ArrowRight size={18} />
                        </button>

                        {role === 'teacher' && (
                            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                {isSignUp ? "Already have an account?" : "Don't have an account?"} {' '}
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    style={{ background: 'none', border: 'none', color: 'var(--secondary-color)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {isSignUp ? "Sign In" : "Sign Up"}
                                </button>
                            </p>
                        )}
                    </form>
                )}

                {/* Step 4: Signup (New Teacher) */}
                {step === 'signup' && (
                    <form onSubmit={handleSignUpSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Registering: {email}</span>
                            <button type="button" onClick={resetFlow} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--secondary-color)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>Change</button>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', outline: 'none' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Subjects (Comma separated)</label>
                            <input
                                type="text"
                                value={subjects}
                                onChange={(e) => setSubjects(e.target.value)}
                                placeholder="e.g. Mathematics, Physics"
                                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', outline: 'none' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Create Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', outline: 'none' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat password"
                                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', outline: 'none' }}
                                required
                            />
                        </div>

                        <button type="submit" className="btn" style={{ width: '100%', background: 'var(--secondary-color)', color: 'white', marginTop: '0.5rem' }}>
                            Complete Registration
                        </button>
                    </form>
                )}

                {/* Step 2: Password Input (Existing User) */}
                {step === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', marginBottom: '0.5rem' }}>
                            <div style={{ padding: '0.25rem', background: 'var(--primary-color)', borderRadius: '50%' }}><CheckCircle2 size={12} color="white" /></div>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{email}</span>
                            <button type="button" onClick={resetFlow} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>Change</button>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s ease' }}
                                    onFocus={(e) => e.target.style.borderColor = role === 'student' ? 'var(--primary-color)' : 'var(--secondary-color)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn" style={{ width: '100%', background: role === 'student' ? 'var(--primary-color)' : 'var(--secondary-color)', color: 'white', marginTop: '0.5rem' }}>
                            Sign In
                        </button>
                    </form>
                )}

                {/* Step 3: Create Password (First-Time User) */}
                {step === 'create-password' && (
                    <form onSubmit={handleCreatePasswordSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ background: 'rgba(99,102,241,0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(99,102,241,0.3)', marginBottom: '0.5rem' }}>
                            <h4 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <CheckCircle2 size={16} color="var(--primary-color)" /> Account Verified
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                Welcome, {foundUser?.name}! This is your first time logging in. Please set up a secure password for your account.
                            </p>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s ease' }}
                                    onFocus={(e) => e.target.style.borderColor = role === 'student' ? 'var(--primary-color)' : 'var(--secondary-color)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s ease' }}
                                    onFocus={(e) => e.target.style.borderColor = role === 'student' ? 'var(--primary-color)' : 'var(--secondary-color)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn" style={{ width: '100%', background: role === 'student' ? 'var(--primary-color)' : 'var(--secondary-color)', color: 'white', marginTop: '0.5rem' }}>
                            Set Password & Sign In
                        </button>
                        <button type="button" onClick={resetFlow} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', marginTop: '-0.5rem' }}>
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
