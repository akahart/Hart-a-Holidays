import { firebaseConfig } from './config.js';

let db = null;
let isInitialized = false;

// Validate UUID format
function isValidUUID(str) {
    if (!str || typeof str !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

// Generate a safe ID
function generateSafeId() {
    return 'h_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Sanitize input to prevent invalid characters
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    // Remove any characters that might cause UUID validation issues
    return input.replace(/[^\w\s\-.:@/]/gi, '');
}

// Initialize Firebase
export async function initFirebase() {
    if (isInitialized) return true;

    try {
        // Check if Firebase config is set
        if (firebaseConfig.apiKey === "YOUR_API_KEY") {
            console.warn("Firebase not configured yet. Using localStorage fallback.");
            return false;
        }

        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getFirestore, enableIndexedDbPersistence } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);

        // Enable offline persistence
        try {
            await enableIndexedDbPersistence(db);
            console.log("Offline persistence enabled");
        } catch (err) {
            if (err.code === 'failed-precondition') {
                console.warn("Persistence failed: Multiple tabs open");
            } else if (err.code === 'unimplemented') {
                console.warn("Persistence not supported in this browser");
            }
        }

        isInitialized = true;
        return true;
    } catch (error) {
        console.error("Firebase initialization error:", error);
        return false;
    }
}

// Get all holidays
export async function getHolidays() {
    try {
        const initialized = await initFirebase();
        
        if (!initialized || !db) {
            // Fallback to localStorage
            const stored = localStorage.getItem('holidays');
            return stored ? JSON.parse(stored) : [];
        }

        const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const q = query(collection(db, 'holidays'), orderBy('outboundDate', 'asc'));
        const snapshot = await getDocs(q);
        
        const holidays = [];
        snapshot.forEach(doc => {
            holidays.push({ id: doc.id, ...doc.data() });
        });
        
        // Also save to localStorage as backup
        localStorage.setItem('holidays', JSON.stringify(holidays));
        
        return holidays;
    } catch (error) {
        console.error("Error getting holidays:", error);
        // Fallback to localStorage
        const stored = localStorage.getItem('holidays');
        return stored ? JSON.parse(stored) : [];
    }
}

// Add a new holiday
export async function addHoliday(holidayData) {
    try {
        // Sanitize all string inputs
        const sanitized = {};
        for (let key in holidayData) {
            if (typeof holidayData[key] === 'string') {
                sanitized[key] = sanitizeInput(holidayData[key]);
            } else {
                sanitized[key] = holidayData[key];
            }
        }

        const initialized = await initFirebase();
        
        if (!initialized || !db) {
            // Fallback to localStorage
            const holidays = JSON.parse(localStorage.getItem('holidays') || '[]');
            const newHoliday = { id: generateSafeId(), ...sanitized, createdAt: new Date().toISOString() };
            holidays.push(newHoliday);
            localStorage.setItem('holidays', JSON.stringify(holidays));
            return newHoliday.id;
        }

        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const docRef = await addDoc(collection(db, 'holidays'), {
            ...sanitized,
            createdAt: new Date().toISOString()
        });
        
        // Update localStorage backup
        const holidays = await getHolidays();
        localStorage.setItem('holidays', JSON.stringify(holidays));
        
        return docRef.id;
    } catch (error) {
        console.error("Error adding holiday:", error);
        throw new Error("Failed to add holiday. Please try again.");
    }
}

// Update a holiday
export async function updateHoliday(id, holidayData) {
    try {
        // Validate ID
        if (!id || id === 'undefined' || id === 'null') {
            throw new Error("Invalid holiday ID");
        }

        // Sanitize all string inputs
        const sanitized = {};
        for (let key in holidayData) {
            if (typeof holidayData[key] === 'string') {
                sanitized[key] = sanitizeInput(holidayData[key]);
            } else {
                sanitized[key] = holidayData[key];
            }
        }

        const initialized = await initFirebase();
        
        if (!initialized || !db) {
            // Fallback to localStorage
            const holidays = JSON.parse(localStorage.getItem('holidays') || '[]');
            const index = holidays.findIndex(h => h.id === id);
            if (index !== -1) {
                holidays[index] = { ...holidays[index], ...sanitized, updatedAt: new Date().toISOString() };
                localStorage.setItem('holidays', JSON.stringify(holidays));
            }
            return;
        }

        const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        await updateDoc(doc(db, 'holidays', id), {
            ...sanitized,
            updatedAt: new Date().toISOString()
        });
        
        // Update localStorage backup
        const holidays = await getHolidays();
        localStorage.setItem('holidays', JSON.stringify(holidays));
    } catch (error) {
        console.error("Error updating holiday:", error);
        throw new Error("Failed to update holiday. Please try again.");
    }
}

// Delete a holiday
export async function deleteHoliday(id) {
    try {
        // Validate ID
        if (!id || id === 'undefined' || id === 'null') {
            throw new Error("Invalid holiday ID");
        }

        const initialized = await initFirebase();
        
        if (!initialized || !db) {
            // Fallback to localStorage
            const holidays = JSON.parse(localStorage.getItem('holidays') || '[]');
            const filtered = holidays.filter(h => h.id !== id);
            localStorage.setItem('holidays', JSON.stringify(filtered));
            return;
        }

        const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        await deleteDoc(doc(db, 'holidays', id));
        
        // Update localStorage backup
        const holidays = await getHolidays();
        localStorage.setItem('holidays', JSON.stringify(holidays));
    } catch (error) {
        console.error("Error deleting holiday:", error);
        throw new Error("Failed to delete holiday. Please try again.");
    }
}

// Get a single holiday by ID
export async function getHoliday(id) {
    try {
        // Validate ID
        if (!id || id === 'undefined' || id === 'null') {
            throw new Error("Invalid holiday ID");
        }

        const initialized = await initFirebase();
        
        if (!initialized || !db) {
            // Fallback to localStorage
            const holidays = JSON.parse(localStorage.getItem('holidays') || '[]');
            return holidays.find(h => h.id === id);
        }

        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const docRef = doc(db, 'holidays', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting holiday:", error);
        return null;
    }
}
