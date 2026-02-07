import { getHolidays, addHoliday, updateHoliday, deleteHoliday, getHoliday } from './firebase.js';
import { ADMIN_PASSWORD } from './config.js';

let editingId = null;
let hotelCount = 0;
let activityCount = 0;

// Check if logged in
function isLoggedIn() {
    return sessionStorage.getItem('adminAuth') === 'true';
}

// Login
window.login = function() {
    const password = document.getElementById('passwordInput').value;
    const errorEl = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'true');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadExistingHolidays();
    } else {
        errorEl.textContent = 'Incorrect password. Please try again.';
        errorEl.style.display = 'block';
    }
};

// Logout
window.logout = function() {
    sessionStorage.removeItem('adminAuth');
    window.location.reload();
};

// Show add form
window.showAddForm = function() {
    editingId = null;
    document.getElementById('formTitle').textContent = 'Add New Holiday';
    document.getElementById('holidayForm').style.display = 'block';
    document.getElementById('addHolidayForm').reset();
    document.getElementById('holidayId').value = '';
    
    // Reset dynamic fields
    document.getElementById('hotelsContainer').innerHTML = '';
    document.getElementById('activitiesContainer').innerHTML = '';
    hotelCount = 0;
    activityCount = 0;
    
    // Scroll to form
    document.getElementById('holidayForm').scrollIntoView({ behavior: 'smooth' });
};

// Cancel form
window.cancelForm = function() {
    document.getElementById('holidayForm').style.display = 'none';
    editingId = null;
};

// Add hotel field
window.addHotel = function() {
    hotelCount++;
    const container = document.getElementById('hotelsContainer');
    const hotelHtml = `
        <div class="hotel-item" id="hotel-${hotelCount}">
            <button type="button" class="remove-btn" onclick="removeHotel(${hotelCount})">Remove</button>
            <div class="form-group">
                <label>Hotel Name</label>
                <input type="text" name="hotelName[]" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Check-in</label>
                    <input type="date" name="hotelCheckIn[]" />
                </div>
                <div class="form-group">
                    <label>Check-out</label>
                    <input type="date" name="hotelCheckOut[]" />
                </div>
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" name="hotelAddress[]" />
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', hotelHtml);
};

// Remove hotel
window.removeHotel = function(id) {
    document.getElementById(`hotel-${id}`).remove();
};

// Add activity field
window.addActivity = function() {
    activityCount++;
    const container = document.getElementById('activitiesContainer');
    const activityHtml = `
        <div class="activity-item" id="activity-${activityCount}">
            <button type="button" class="remove-btn" onclick="removeActivity(${activityCount})">Remove</button>
            <div class="form-group">
                <label>Description</label>
                <input type="text" name="activityDescription[]" />
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" name="activityDate[]" />
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', activityHtml);
};

// Remove activity
window.removeActivity = function(id) {
    document.getElementById(`activity-${id}`).remove();
};

// Collect form data
function collectFormData() {
    const data = {
        destination: document.getElementById('destination').value,
        outboundFrom: document.getElementById('outboundFrom').value,
        outboundTo: document.getElementById('outboundTo').value,
        outboundDate: document.getElementById('outboundDate').value,
        outboundTime: document.getElementById('outboundTime').value,
        outboundFlightNumber: document.getElementById('outboundFlightNumber').value,
        outboundTerminal: document.getElementById('outboundTerminal').value,
        returnFrom: document.getElementById('returnFrom').value,
        returnTo: document.getElementById('returnTo').value,
        returnDate: document.getElementById('returnDate').value,
        returnTime: document.getElementById('returnTime').value,
        returnFlightNumber: document.getElementById('returnFlightNumber').value,
        returnTerminal: document.getElementById('returnTerminal').value,
        otherNotes: document.getElementById('otherNotes').value,
        hotels: [],
        activities: []
    };
    
    // Collect hotels
    const hotelNames = document.getElementsByName('hotelName[]');
    const hotelCheckIns = document.getElementsByName('hotelCheckIn[]');
    const hotelCheckOuts = document.getElementsByName('hotelCheckOut[]');
    const hotelAddresses = document.getElementsByName('hotelAddress[]');
    
    for (let i = 0; i < hotelNames.length; i++) {
        if (hotelNames[i].value) {
            data.hotels.push({
                name: hotelNames[i].value,
                checkIn: hotelCheckIns[i].value,
                checkOut: hotelCheckOuts[i].value,
                address: hotelAddresses[i].value
            });
        }
    }
    
    // Collect activities
    const activityDescriptions = document.getElementsByName('activityDescription[]');
    const activityDates = document.getElementsByName('activityDate[]');
    
    for (let i = 0; i < activityDescriptions.length; i++) {
        if (activityDescriptions[i].value) {
            data.activities.push({
                description: activityDescriptions[i].value,
                date: activityDates[i].value
            });
        }
    }
    
    return data;
}

// Handle form submission
document.getElementById('addHolidayForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = collectFormData();
    
    try {
        if (editingId) {
            await updateHoliday(editingId, data);
            alert('Holiday updated successfully!');
        } else {
            await addHoliday(data);
            alert('Holiday added successfully!');
        }
        
        document.getElementById('holidayForm').style.display = 'none';
        document.getElementById('addHolidayForm').reset();
        editingId = null;
        loadExistingHolidays();
    } catch (error) {
        alert('Error saving holiday: ' + error.message);
    }
});

// Load existing holidays
async function loadExistingHolidays() {
    const container = document.getElementById('existingHolidays');
    
    try {
        const holidays = await getHolidays();
        
        if (holidays.length === 0) {
            container.innerHTML = '<p style="color: #999;">No holidays yet. Add your first one above!</p>';
            return;
        }
        
        container.innerHTML = holidays.map(holiday => `
            <div class="admin-holiday-card">
                <div class="admin-holiday-info">
                    <h3>${holiday.destination || 'Unknown'}</h3>
                    <p>${holiday.outboundDate ? new Date(holiday.outboundDate).toLocaleDateString() : 'No date'}</p>
                </div>
                <div class="admin-actions">
                    <button class="edit-btn" onclick="editHoliday('${holiday.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteHolidayConfirm('${holiday.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p style="color: red;">Error loading holidays</p>';
    }
}

// Edit holiday
window.editHoliday = async function(id) {
    try {
        const holiday = await getHoliday(id);
        
        if (!holiday) {
            alert('Holiday not found');
            return;
        }
        
        editingId = id;
        document.getElementById('formTitle').textContent = 'Edit Holiday';
        document.getElementById('holidayId').value = id;
        
        // Fill form
        document.getElementById('destination').value = holiday.destination || '';
        document.getElementById('outboundFrom').value = holiday.outboundFrom || '';
        document.getElementById('outboundTo').value = holiday.outboundTo || '';
        document.getElementById('outboundDate').value = holiday.outboundDate || '';
        document.getElementById('outboundTime').value = holiday.outboundTime || '';
        document.getElementById('outboundFlightNumber').value = holiday.outboundFlightNumber || '';
        document.getElementById('outboundTerminal').value = holiday.outboundTerminal || '';
        document.getElementById('returnFrom').value = holiday.returnFrom || '';
        document.getElementById('returnTo').value = holiday.returnTo || '';
        document.getElementById('returnDate').value = holiday.returnDate || '';
        document.getElementById('returnTime').value = holiday.returnTime || '';
        document.getElementById('returnFlightNumber').value = holiday.returnFlightNumber || '';
        document.getElementById('returnTerminal').value = holiday.returnTerminal || '';
        document.getElementById('otherNotes').value = holiday.otherNotes || '';
        
        // Clear and repopulate hotels
        document.getElementById('hotelsContainer').innerHTML = '';
        hotelCount = 0;
        if (holiday.hotels) {
            holiday.hotels.forEach(hotel => {
                addHotel();
                const lastHotel = document.querySelector('#hotelsContainer .hotel-item:last-child');
                lastHotel.querySelector('input[name="hotelName[]"]').value = hotel.name || '';
                lastHotel.querySelector('input[name="hotelCheckIn[]"]').value = hotel.checkIn || '';
                lastHotel.querySelector('input[name="hotelCheckOut[]"]').value = hotel.checkOut || '';
                lastHotel.querySelector('input[name="hotelAddress[]"]').value = hotel.address || '';
            });
        }
        
        // Clear and repopulate activities
        document.getElementById('activitiesContainer').innerHTML = '';
        activityCount = 0;
        if (holiday.activities) {
            holiday.activities.forEach(activity => {
                addActivity();
                const lastActivity = document.querySelector('#activitiesContainer .activity-item:last-child');
                lastActivity.querySelector('input[name="activityDescription[]"]').value = activity.description || '';
                lastActivity.querySelector('input[name="activityDate[]"]').value = activity.date || '';
            });
        }
        
        document.getElementById('holidayForm').style.display = 'block';
        document.getElementById('holidayForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert('Error loading holiday: ' + error.message);
    }
};

// Delete holiday with confirmation
window.deleteHolidayConfirm = function(id) {
    if (confirm('Are you sure you want to delete this holiday? This cannot be undone.')) {
        deleteHolidayNow(id);
    }
};

async function deleteHolidayNow(id) {
    try {
        await deleteHoliday(id);
        alert('Holiday deleted successfully');
        loadExistingHolidays();
    } catch (error) {
        alert('Error deleting holiday: ' + error.message);
    }
}

// Initialize
if (isLoggedIn()) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadExistingHolidays();
} else {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

// Allow Enter key to login
document.getElementById('passwordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        login();
    }
});
