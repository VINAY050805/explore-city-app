let currentPlace;
let allPlaces = [];

// Get the base URL for API calls
const API_BASE_URL = 'http://localhost:5000';

<<<<<<< HEAD

// Load places from backend
async function loadPlaces(category = 'All') {
    try {
        let url = 'http://localhost:5000/api/places';
=======
// Load places from backend
async function loadPlaces(category = 'All') {
    try {
        let url = `${API_BASE_URL}/api/places`;
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
        if (category !== 'All') {
            url += `?category=${category}`;
        }
        
<<<<<<< HEAD
        const response = await fetch(url);
=======
        console.log('Fetching from:', url); // Debug log
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
        allPlaces = await response.json();
        showPlaces(allPlaces);
    } catch (error) {
        console.error('Error loading places:', error);
<<<<<<< HEAD
        // Fallback to local data if backend is not available
        if (typeof places !== 'undefined') {
            allPlaces = places;
            showPlaces(allPlaces);
        }
=======
        document.getElementById("places").innerHTML = `<p style="text-align: center; color: red;">Error loading places. Make sure the backend server is running at ${API_BASE_URL}</p>`;
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
    }
}

function showPlaces(list) {
    const container = document.getElementById("places");
    container.innerHTML = "";

<<<<<<< HEAD
=======
    if (list.length === 0) {
        container.innerHTML = "<p style='text-align: center; width: 100%;'>No places found</p>";
        return;
    }

>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
    list.forEach(place => {
        container.innerHTML += `
        <div class="card">
            <img src="${place.image}" width="100%" onerror="this.src='https://via.placeholder.com/230x150'">
            <h3>${place.name}</h3>
            <button onclick="openModal(${place.id})">View Details</button>
        </div>`;
    });
}

// Filter
async function filterCategory(cat) {
    await loadPlaces(cat);
}

// Search
document.getElementById("search").addEventListener("input", async function() {
    const value = this.value.toLowerCase();
    
    if (value.trim() === '') {
        showPlaces(allPlaces);
    } else {
        try {
<<<<<<< HEAD
            const response = await fetch(`http://localhost:5000/api/places/search?q=${value}`);
=======
            const response = await fetch(`${API_BASE_URL}/api/places/search?q=${value}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
            const filtered = await response.json();
            showPlaces(filtered);
        } catch (error) {
            console.error('Error searching places:', error);
<<<<<<< HEAD
            // Fallback to local filtering
            const filtered = allPlaces.filter(p =>
                p.name.toLowerCase().includes(value)
            );
            showPlaces(filtered);
=======
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
        }
    }
});

<<<<<<< HEAD
// Function to generate Google Maps URL
function getGoogleMapsUrl(place) {
    // Method 1: Using place name (best for user readability)
    if (place.location) {
        return `https://maps.google.com/maps?q=${place.location}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    // Method 2: Using coordinates (most accurate)
    if (place.lat && place.lng) {
        return `https://maps.google.com/maps?q=${place.lat},${place.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    // Method 3: Using place name as fallback
    return `https://maps.google.com/maps?q=${encodeURIComponent(place.name + ', Mysuru')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

// Modal
async function openModal(id) {
    try {
        // Try to fetch from backend first
        let place;
        try {
            const response = await fetch(`http://localhost:5000/api/places/${id}`);
            place = await response.json();
        } catch (error) {
            // Fallback to local data
            place = allPlaces.find(p => p.id === id) || places.find(p => p.id === id);
        }
        
        currentPlace = place;

        // Update modal content
        document.getElementById("modal-img").src = place.image;
        document.getElementById("modal-title").innerText = place.name;
        document.getElementById("modal-desc").innerText = place.desc;

        // Update map with correct location
        const mapIframe = document.getElementById("map-iframe");
        const mapUrl = getGoogleMapsUrl(place);
        mapIframe.src = mapUrl;
        
        // Add a small label showing the location (optional)
        const mapContainer = document.getElementById("map-container");
        if (!document.getElementById('map-location-label')) {
            const label = document.createElement('small');
            label.id = 'map-location-label';
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            label.style.color = '#666';
            mapContainer.insertBefore(label, mapIframe);
        }
        document.getElementById('map-location-label').innerHTML = `📍 ${place.name}`;
=======
// Modal
async function openModal(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/places/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        currentPlace = await response.json();

        document.getElementById("modal-img").src = currentPlace.image;
        document.getElementById("modal-title").innerText = currentPlace.name;
        document.getElementById("modal-desc").innerText = currentPlace.desc;
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082

        document.getElementById("modal").style.display = "block";
        
        // Store place ID for reviews
        document.getElementById('modal').setAttribute('data-place-id', id);
        
        await loadReviews(id);
    } catch (error) {
        console.error('Error loading place details:', error);
        alert('Error loading place details. Please try again.');
    }
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("review").value = '';
}

// Favorites
async function addToFavorites() {
    try {
<<<<<<< HEAD
        const response = await fetch('http://localhost:5000/api/favorites', {
=======
        const response = await fetch(`${API_BASE_URL}/api/favorites`, {
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ place_id: currentPlace.id })
        });
        
        if (response.ok) {
            alert('Added to favorites! ⭐');
        } else {
            const data = await response.json();
            alert(data.message || 'Error adding to favorites');
        }
    } catch (error) {
        console.error('Error adding to favorites:', error);
<<<<<<< HEAD
        // Fallback to localStorage
        let favs = JSON.parse(localStorage.getItem("favorites")) || [];
        if (!favs.some(f => f.id === currentPlace.id)) {
            favs.push(currentPlace);
            localStorage.setItem("favorites", JSON.stringify(favs));
            alert("Added to favorites (local)");
        } else {
            alert("Already in favorites");
        }
=======
        alert('Error adding to favorites. Please try again.');
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
    }
}

// Reviews
async function saveReview() {
    const text = document.getElementById("review").value;
    const placeId = document.getElementById('modal').getAttribute('data-place-id');

    if (text.trim() === "") return;

    try {
<<<<<<< HEAD
        const response = await fetch('http://localhost:5000/api/reviews', {
=======
        const response = await fetch(`${API_BASE_URL}/api/reviews`, {
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                place_id: placeId,
                content: text 
            })
        });
        
        if (response.ok) {
            document.getElementById("review").value = "";
            await loadReviews(placeId);
<<<<<<< HEAD
        }
    } catch (error) {
        console.error('Error saving review:', error);
        // Fallback to localStorage
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews.push(text);
        localStorage.setItem("reviews", JSON.stringify(reviews));
        document.getElementById("review").value = "";
        loadReviews(placeId);
=======
        } else {
            const data = await response.json();
            alert(data.message || 'Error saving review');
        }
    } catch (error) {
        console.error('Error saving review:', error);
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
    }
}

async function loadReviews(placeId) {
    try {
<<<<<<< HEAD
        const response = await fetch(`http://localhost:5000/api/reviews/${placeId}`);
=======
        const response = await fetch(`${API_BASE_URL}/api/reviews/${placeId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
        const reviews = await response.json();
        
        const container = document.getElementById("reviewList");
        
        if (reviews.length === 0) {
            container.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
        } else {
            container.innerHTML = reviews.map(r => 
                `<p>• ${r.content} <small>(${new Date(r.created_at).toLocaleDateString()})</small></p>`
            ).join('');
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
<<<<<<< HEAD
        // Fallback to localStorage
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        const container = document.getElementById("reviewList");
        if (reviews.length === 0) {
            container.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
        } else {
            container.innerHTML = reviews.map(r => 
                `<p>• ${r}</p>`
            ).join('');
        }
=======
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD
    // Check if places exist in global scope (from data.js)
    if (typeof places !== 'undefined') {
        allPlaces = places;
        showPlaces(allPlaces);
    } else {
        loadPlaces();
    }
=======
    loadPlaces();
>>>>>>> f580b567a12e3c1c4f4a0023fdc2fe5257817082
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            closeModal();
        }
    }
});