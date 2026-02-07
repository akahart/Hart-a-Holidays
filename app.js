import { getHolidays } from './firebase.js';

// Calculate days until a date
function daysUntil(dateString) {
    if (!dateString) return null;
    const target = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
}

// Calculate holiday duration
function calculateDuration(outboundDate, returnDate) {
    if (!outboundDate || !returnDate) return null;
    const outbound = new Date(outboundDate);
    const returnD = new Date(returnDate);
    const diff = Math.ceil((returnD - outbound) / (1000 * 60 * 60 * 24));
    return diff;
}

// Determine holiday status
function getHolidayStatus(outboundDate, returnDate) {
    const days = daysUntil(outboundDate);
    const returnDays = daysUntil(returnDate);
    
    if (days > 0) return 'upcoming';
    if (returnDays >= 0 && days <= 0) return 'current';
    return 'past';
}

// Format date nicely
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Render holiday cards
function renderHolidays(holidays) {
    const container = document.getElementById('holidaysList');
    const emptyState = document.getElementById('emptyState');
    
    if (!holidays || holidays.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Sort: current first, then upcoming by date, then past
    const sorted = holidays.sort((a, b) => {
        const statusA = getHolidayStatus(a.outboundDate, a.returnDate);
        const statusB = getHolidayStatus(b.outboundDate, b.returnDate);
        
        if (statusA === 'current') return -1;
        if (statusB === 'current') return 1;
        if (statusA === 'upcoming' && statusB === 'past') return -1;
        if (statusA === 'past' && statusB === 'upcoming') return 1;
        
        return new Date(a.outboundDate) - new Date(b.outboundDate);
    });
    
    container.innerHTML = sorted.map(holiday => {
        const days = daysUntil(holiday.outboundDate);
        const duration = calculateDuration(holiday.outboundDate, holiday.returnDate);
        const status = getHolidayStatus(holiday.outboundDate, holiday.returnDate);
        
        let countdownHtml = '';
        if (status === 'upcoming') {
            countdownHtml = `
                <div class="countdown">${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'}</div>
                <div class="countdown-label">until departure</div>
            `;
        } else if (status === 'current') {
            const returnDays = daysUntil(holiday.returnDate);
            countdownHtml = `
                <div class="countdown">🎉 Enjoy!</div>
                <div class="countdown-label">${returnDays} ${returnDays === 1 ? 'day' : 'days'} left</div>
            `;
        } else {
            countdownHtml = `
                <div class="countdown">Completed</div>
                <div class="countdown-label">${formatDate(holiday.outboundDate)}</div>
            `;
        }
        
        return `
            <div class="holiday-card ${status}" onclick="viewHoliday('${holiday.id}')">
                <div class="holiday-header">
                    <div class="destination">${holiday.destination || 'Unknown Destination'}</div>
                    <div class="status-badge ${status}">${status}</div>
                </div>
                ${countdownHtml}
                ${duration ? `<div class="duration">${duration} ${duration === 1 ? 'day' : 'days'} holiday</div>` : ''}
            </div>
        `;
    }).join('');
}

// View holiday details
window.viewHoliday = function(id) {
    window.location.href = `details.html?id=${id}`;
};

// Load holidays
async function loadHolidays() {
    try {
        const holidays = await getHolidays();
        renderHolidays(holidays);
    } catch (error) {
        console.error('Error loading holidays:', error);
        document.getElementById('holidaysList').innerHTML = `
            <div class="loading" style="color: white;">
                Error loading holidays. Please refresh the page.
            </div>
        `;
    }
}

// Admin button
document.getElementById('adminBtn').addEventListener('click', () => {
    window.location.href = 'admin.html';
});

// Initialize
loadHolidays();

// Reload holidays every minute to update countdowns
setInterval(loadHolidays, 60000);
