const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const today = new Date();
const todayDay = today.getDate();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();


let currentDate = new Date(); // Default to current date

// Function to generate the calendar for the current month
function generateCalendar() {
    const monthName = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    
    // Update the month header
    document.getElementById('month-name').textContent = `${monthName} ${year}`;

    // Get the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
    const lastDateOfMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

    // Clear the previous calendar body
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';

  // Add empty spaces before the first date
for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement('div');
    calendarBody.appendChild(emptyCell); // No class added, so it won't be styled
}

    // Add the dates to the calendar
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dateCell = document.createElement('div');
        dateCell.classList.add('calendar-date');
        dateCell.textContent = i;

        // Highlight today's date
        if (i === todayDay && currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear) {
            dateCell.classList.add('today'); // Apply a special class for today's date
        }

        calendarBody.appendChild(dateCell);
    }
}
// Function to go to the previous month
document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
});

// Function to go to the next month
document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
});

// Generate the calendar when the page loads
generateCalendar();
