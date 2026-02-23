/**
 * Run this script (or call this function) once you have your Firebase credentials
 * in src/utils/firebase.js to populate your Firestore with the initial users.
 */

import { db } from './firebase';
import { collection, doc, setDoc } from "firebase/firestore";

const initialUsers = [
    { id: 's1', email: 'student@example.com', role: 'student', password: null, name: 'Jane Smith' },
    { id: 't1', email: 'teacher@example.com', role: 'teacher', password: null, name: 'John Doe' },
    { id: 's2', email: 'alex@example.com', role: 'student', password: 'password123', name: 'Alex Johnson' },
    { id: 't2', email: 'sarah@example.com', role: 'teacher', password: 'password123', name: 'Sarah Williams' }
];

export const seedFirestore = async () => {
    console.log("Starting seeding...");
    try {
        for (const user of initialUsers) {
            await setDoc(doc(db, "users", user.id), user);
            console.log(`Seeded: ${user.email}`);
        }
        console.log("Seeding complete!");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
};
