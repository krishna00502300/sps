const database = firebase.database();

// Function to update parking status
function updateParkingStatus() {
    const parkingBlocks = document.querySelectorAll('.parking-block');

    parkingBlocks.forEach((block, index) => {
        const parkingRef = database.ref(`parking/parking${index + 1}`);
        parkingRef.once('value', (snapshot) => {
            const status = snapshot.val();

            if (status === -1) {
                block.className = 'parking-block green';
                block.innerHTML = '';
            } else if (status === 0) {
                block.className = 'parking-block yellow';
                block.innerHTML = '';
            } else if (status === 1) {
                block.className = 'parking-block red';
                block.innerHTML = '<img src="Car.jpg" alt="Car">';
            } else if (status === 2) {
                block.className = 'parking-block red';
                block.innerHTML = '<img src="https://t4.ftcdn.net/jpg/05/36/19/15/360_F_536191589_RUpBzTpGj4mrBWSdGY1EBiixEMrKnEff.jpg" alt="Car">';
            }

        });
    });
}

// Update parking status every 5 seconds
setInterval(updateParkingStatus, 5000);

// Initial update
updateParkingStatus();


// Booking Popup functionality
function bookParking(id) {
    const parkingRef = database.ref(`parking/parking${id}`);
    parkingRef.once('value', (snapshot) => {
        const status = snapshot.val();

        // Check the current status of the parking slot
        if (status === -1) {
            const bookingPopup = document.getElementById('bookingPopup');
            const bookingNameInput = document.getElementById('bookingName');

            // Display the booking popup
            bookingPopup.style.display = 'flex';

            // Set a data attribute to identify the parking block clicked
            bookingPopup.setAttribute('data-parking-id', id);

            // Clear previous input value
            bookingNameInput.value = '';
        } else {
            // Parking is already booked or unavailable, display the current status
            alert(`Parking slot ${id} is currently ${status === 1 ? 'booked' : 'unavailable'}.`);
        }
    });
}


// Close the booking popup
function closePopup() {
    const bookingPopup = document.getElementById('bookingPopup');
    bookingPopup.style.display = 'none';
}

// Confirm booking and update Firebase
function confirmBooking() {
    const bookingPopup = document.getElementById('bookingPopup');
    const parkingId = bookingPopup.getAttribute('data-parking-id');
    const bookingNameInput = document.getElementById('bookingName');
    const bookingName = bookingNameInput.value.trim();

    // Check if the booking name is provided
    if (bookingName !== '') {
        // Update Firebase with the booking status (set to 0)
        const parkingRef = database.ref(`parking/parking${parkingId}`);
        parkingRef.set(0).then(() => {
            console.log(`Parking ${parkingId} booked by ${bookingName}`);
            // Close the booking popup after successful booking
            closePopup();
        }).catch((error) => {
            console.error('Error updating Firebase:', error);
        });
    } else {
        // Notify the user that the booking name is required
        alert('Please enter your name for booking.');
    }
}

