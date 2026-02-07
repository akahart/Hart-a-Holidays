import { getHoliday } from './firebase.js';

// Get holiday ID from URL
const urlParams = new URLSearchParams(window.location.search);
const holidayId = urlParams.get('id');

// Format date nicely
function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
        weekday: 'short',
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
}

// Format time
function formatTime(timeString) {
    if (!timeString) return '';
    return timeString;
}

// Render holiday details
function renderDetails(holiday) {
    if (!holiday) {
        document.getElementById('holidayDetails').innerHTML = `
            <div class="loading">Holiday not found</div>
        `;
        return;
    }
    
    document.getElementById('holidayTitle').textContent = holiday.destination || 'Holiday Details';
    
    let html = '';
    
    // Outbound Flight
    if (holiday.outboundDate || holiday.outboundFrom) {
        html += `
            <div class="detail-section">
                <h2>✈️ Outbound Flight</h2>
                <div class="flight-info">
                    ${holiday.outboundFrom || holiday.outboundTo ? `
                        <div class="info-row">
                            <span class="info-label">Route:</span>
                            <span class="info-value">${holiday.outboundFrom || ''} → ${holiday.outboundTo || ''}</span>
                        </div>
                    ` : ''}
                    ${holiday.outboundDate ? `
                        <div class="info-row">
                            <span class="info-label">Date:</span>
                            <span class="info-value">${formatDate(holiday.outboundDate)}</span>
                        </div>
                    ` : ''}
                    ${holiday.outboundTime ? `
                        <div class="info-row">
                            <span class="info-label">Time:</span>
                            <span class="info-value">${formatTime(holiday.outboundTime)}</span>
                        </div>
                    ` : ''}
                    ${holiday.outboundFlightNumber ? `
                        <div class="info-row">
                            <span class="info-label">Flight Number:</span>
                            <span class="info-value">${holiday.outboundFlightNumber}</span>
                        </div>
                    ` : ''}
                    ${holiday.outboundTerminal ? `
                        <div class="info-row">
                            <span class="info-label">Terminal:</span>
                            <span class="info-value">${holiday.outboundTerminal}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Return Flight
    if (holiday.returnDate || holiday.returnFrom) {
        html += `
            <div class="detail-section">
                <h2>🛬 Return Flight</h2>
                <div class="flight-info">
                    ${holiday.returnFrom || holiday.returnTo ? `
                        <div class="info-row">
                            <span class="info-label">Route:</span>
                            <span class="info-value">${holiday.returnFrom || ''} → ${holiday.returnTo || ''}</span>
                        </div>
                    ` : ''}
                    ${holiday.returnDate ? `
                        <div class="info-row">
                            <span class="info-label">Date:</span>
                            <span class="info-value">${formatDate(holiday.returnDate)}</span>
                        </div>
                    ` : ''}
                    ${holiday.returnTime ? `
                        <div class="info-row">
                            <span class="info-label">Time:</span>
                            <span class="info-value">${formatTime(holiday.returnTime)}</span>
                        </div>
                    ` : ''}
                    ${holiday.returnFlightNumber ? `
                        <div class="info-row">
                            <span class="info-label">Flight Number:</span>
                            <span class="info-value">${holiday.returnFlightNumber}</span>
                        </div>
                    ` : ''}
                    ${holiday.returnTerminal ? `
                        <div class="info-row">
                            <span class="info-label">Terminal:</span>
                            <span class="info-value">${holiday.returnTerminal}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Hotels
    if (holiday.hotels && holiday.hotels.length > 0) {
        html += `
            <div class="detail-section">
                <h2>🏨 Accommodation</h2>
                ${holiday.hotels.map(hotel => `
                    <div class="hotel-info">
                        ${hotel.name ? `
                            <div class="info-row">
                                <span class="info-label">Hotel:</span>
                                <span class="info-value">${hotel.name}</span>
                            </div>
                        ` : ''}
                        ${hotel.checkIn || hotel.checkOut ? `
                            <div class="info-row">
                                <span class="info-label">Dates:</span>
                                <span class="info-value">${formatDate(hotel.checkIn)} - ${formatDate(hotel.checkOut)}</span>
                            </div>
                        ` : ''}
                        ${hotel.address ? `
                            <div class="info-row">
                                <span class="info-label">Address:</span>
                                <span class="info-value">${hotel.address}</span>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Activities & Transport
    if (holiday.activities && holiday.activities.length > 0) {
        html += `
            <div class="detail-section">
                <h2>🎯 Activities & Transport</h2>
                ${holiday.activities.map(activity => `
                    <div class="activity-info">
                        ${activity.description ? `
                            <div class="info-row">
                                <span class="info-label">Activity:</span>
                                <span class="info-value">${activity.description}</span>
                            </div>
                        ` : ''}
                        ${activity.date ? `
                            <div class="info-row">
                                <span class="info-label">Date:</span>
                                <span class="info-value">${formatDate(activity.date)}</span>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Other Notes
    if (holiday.otherNotes) {
        html += `
            <div class="detail-section">
                <h2>📝 Other Notes</h2>
                <div class="info-value" style="white-space: pre-wrap;">${holiday.otherNotes}</div>
            </div>
        `;
    }
    
    if (!html) {
        html = '<div class="loading">No details available for this holiday yet.</div>';
    }
    
    document.getElementById('holidayDetails').innerHTML = html;
}

// Load holiday details
async function loadDetails() {
    if (!holidayId) {
        document.getElementById('holidayDetails').innerHTML = `
            <div class="loading">No holiday selected</div>
        `;
        return;
    }
    
    try {
        const holiday = await getHoliday(holidayId);
        renderDetails(holiday);
    } catch (error) {
        console.error('Error loading holiday:', error);
        document.getElementById('holidayDetails').innerHTML = `
            <div class="loading">Error loading holiday details</div>
        `;
    }
}

// Initialize
loadDetails();
