import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { initializeMockDb, getCurrentSession } from './utils/mockDb';

// Simple protective wrapper for future dashboard routes
const ProtectedRoute = ({ children, allowedRole }) => {
    const session = getCurrentSession();
    if (!session) return <Navigate to="/login" replace />;
    if (allowedRole && session.role !== allowedRole) return <Navigate to="/" replace />;
    return children;
};

function App() {
    useEffect(() => {
        const init = async () => {
            // Initialize mock database with sample users on first load
            await initializeMockDb();
        };
        init();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<SignIn />} />

                {/* Secured Routes */}
                <Route
                    path="/student-portal"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher-portal"
                    element={
                        <ProtectedRoute allowedRole="teacher">
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin-portal"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
