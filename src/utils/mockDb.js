// Refactored Database layer to use real Firestore operations where possible, 
// fallen back to LocalStorage for offline development if credentials are not yet set.

import { db } from './firebase';
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    setDoc,
    getDoc
} from "firebase/firestore";

const USERS_COLLECTION = 'users';

// This function checks if we have valid-looking Firebase credentials
const isFirebaseReady = () => {
    // Basic check for placeholder values
    const config = db.app.options;
    return config && config.apiKey && config.apiKey !== "YOUR_API_KEY";
};

// INITIAL DATA SEEDING (FOR LOCAL STORAGE BACKUP)
const initialUsers = [
    { id: 'admin1', email: 'Admin', role: 'admin', password: 'Iamadmin2626', name: 'System Admin' },
    { id: 's1', email: 'student@example.com', role: 'student', password: null, name: 'Jane Smith', subjects: ['Mathematics', 'English'] },
    { id: 't1', email: 'teacher@example.com', role: 'teacher', password: null, name: 'John Doe', subjects: ['Mathematics', 'Physics'] },
    { id: 's2', email: 'alex@example.com', role: 'student', password: 'password123', name: 'Alex Johnson', subjects: ['Physics', 'Chemistry'] },
    { id: 't2', email: 'sarah@example.com', role: 'teacher', password: 'password123', name: 'Sarah Williams', subjects: ['English', 'Biology'] }
];

const initialSchedules = [
    // Jane Smith (s1) classes
    { id: 'c1', studentId: 's1', teacherId: 't1', studentName: 'Jane Smith', teacherName: 'John Doe', subject: 'Mathematics', day: 'Monday', date: '2026-02-23', time: '10:00 AM' },
    { id: 'c2', studentId: 's1', teacherId: 't2', studentName: 'Jane Smith', teacherName: 'Sarah Williams', subject: 'English', day: 'Wednesday', date: '2026-02-25', time: '02:00 PM' },
    { id: 'c3', studentId: 's1', teacherId: 't1', studentName: 'Jane Smith', teacherName: 'John Doe', subject: 'Mathematics', day: 'Friday', date: '2026-02-27', time: '11:00 AM' },

    // Alex Johnson (s2) classes
    { id: 'c4', studentId: 's2', teacherId: 't1', studentName: 'Alex Johnson', teacherName: 'John Doe', subject: 'Physics', day: 'Tuesday', date: '2026-02-24', time: '09:00 AM' },
    { id: 'c5', studentId: 's2', teacherId: 't2', studentName: 'Alex Johnson', teacherName: 'Sarah Williams', subject: 'Chemistry', day: 'Thursday', date: '2026-02-26', time: '04:00 PM' }
];

export const initializeMockDb = async () => {
    if (isFirebaseReady()) {
        console.log("Firebase is ready. Ensuring initial users exist...");
        // Future implementation: Check if users collection is empty and seed it
    } else {
        console.warn("Firebase credentials not found. Falling back to LocalStorage.");
        const storedUsers = localStorage.getItem('edufy_mock_users');
        if (!storedUsers) {
            localStorage.setItem('edufy_mock_users', JSON.stringify(initialUsers));
        } else {
            // Ensure Admin user is updated/added if it's a new addition
            const users = JSON.parse(storedUsers);
            if (!users.find(u => u.email.toLowerCase() === 'admin')) {
                users.push(initialUsers[0]);
                localStorage.setItem('edufy_mock_users', JSON.stringify(users));
            }
        }
        if (!localStorage.getItem('edufy_mock_schedules')) {
            localStorage.setItem('edufy_mock_schedules', JSON.stringify(initialSchedules));
        }
    }
};

export const getUserByEmailAndRole = async (email, role) => {
    if (isFirebaseReady()) {
        try {
            const q = query(collection(db, USERS_COLLECTION), where("email", "==", email), where("role", "==", role));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                return { id: userDoc.id, ...userDoc.data() };
            }
            return null;
        } catch (e) {
            console.error("Firestore Error:", e);
            return null;
        }
    } else {
        const users = JSON.parse(localStorage.getItem('edufy_mock_users') || '[]');
        // Special case for Admin login override via "teacher" role in UI
        if (email.toLowerCase() === 'admin' && role === 'teacher') {
            return users.find(u => u.email.toLowerCase() === 'admin' && u.role === 'admin') || null;
        }
        return users.find(u => u.email === email && u.role === role) || null;
    }
};

export const getAllUsers = async () => {
    if (isFirebaseReady()) {
        // Future Firestore implementation
        return [];
    } else {
        const users = JSON.parse(localStorage.getItem('edufy_mock_users') || '[]');
        return users;
    }
};

export const addUser = async (email, role, name, subjects = []) => {
    if (isFirebaseReady()) {
        // Future Firestore implementation
    } else {
        const users = JSON.parse(localStorage.getItem('edufy_mock_users') || '[]');
        const newUser = {
            id: 'u' + Date.now(),
            email,
            role,
            name,
            subjects,
            password: null // Forced setup
        };
        users.push(newUser);
        localStorage.setItem('edufy_mock_users', JSON.stringify(users));
        return newUser;
    }
};

export const deleteUser = async (userId) => {
    if (isFirebaseReady()) {
        // Future Firestore implementation
    } else {
        let users = JSON.parse(localStorage.getItem('edufy_mock_users') || '[]');
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('edufy_mock_users', JSON.stringify(users));
    }
};

export const resetUserPassword = async (userId) => {
    if (isFirebaseReady()) {
        // Future Firestore implementation
    } else {
        const users = JSON.parse(localStorage.getItem('edufy_mock_users') || '[]');
        const updatedUsers = users.map(u =>
            u.id === userId ? { ...u, password: null } : u
        );
        localStorage.setItem('edufy_mock_users', JSON.stringify(updatedUsers));
    }
};

export const updateUser = async (userId, data) => {
    if (isFirebaseReady()) {
        // Future Firestore implementation
    } else {
        const users = JSON.parse(localStorage.getItem('edufy_mock_users') || '[]');
        const updatedUsers = users.map(u =>
            u.id === userId ? { ...u, ...data } : u
        );
        localStorage.setItem('edufy_mock_users', JSON.stringify(updatedUsers));
    }
};

export const getStudentClasses = async (studentId) => {
    if (isFirebaseReady()) {
        // Future Firestore implementation
        return [];
    } else {
        const schedules = JSON.parse(localStorage.getItem('edufy_mock_schedules') || '[]');
        return schedules.filter(s => s.studentId === studentId);
    }
};

export const getTeacherClasses = async (teacherId) => {
    if (isFirebaseReady()) {
        // Future Firestore implementation
        return [];
    } else {
        const schedules = JSON.parse(localStorage.getItem('edufy_mock_schedules') || '[]');
        return schedules.filter(s => s.teacherId === teacherId);
    }
};

export const updateUserPassword = async (userId, newPassword) => {
    if (isFirebaseReady()) {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId);
            await updateDoc(userRef, { password: newPassword });
        } catch (e) {
            console.error("Firestore update error:", e);
        }
    } else {
        const users = JSON.parse(localStorage.getItem('edufy_mock_users') || '[]');
        const updatedUsers = users.map(u =>
            u.id === userId ? { ...u, password: newPassword } : u
        );
        localStorage.setItem('edufy_mock_users', JSON.stringify(updatedUsers));
    }
};

// Session logic (still using localStorage for JWT/Session token persistence in browser)
const AUTH_KEY = 'edufy_auth_session';

export const loginUser = (user) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id, role: user.role, name: user.name }));
};

export const logoutUser = () => {
    localStorage.removeItem(AUTH_KEY);
};

export const getCurrentSession = () => {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
};
