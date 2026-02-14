let currentPlace;
let allPlaces = [];

// Get the base URL for API calls
const API_BASE_URL = 'http://localhost:5000';


// Load places from backend
async function loadPlaces(category = 'All') {
    try {
        let url = 'http://localhost:5000/api/places';
        if (category !== 'All') {
            url += `?category=${category}`;
        }
        
        const response = await fetch(url);
        allPlaces = await response.json();
        showPlaces(allPlaces);
    } catch (error) {
        console.error('Error loading places:', error);
        // Fallback to local data if backend is not available
        if (typeof places !== 'undefined') {
            allPlaces = places;
            showPlaces(allPlaces);
        }
    }
}

function showPlaces(list) {
    const container = document.getElementById("places");
    container.innerHTML = "";

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
            const response = await fetch(`http://localhost:5000/api/places/search?q=${value}`);
            const filtered = await response.json();
            showPlaces(filtered);
        } catch (error) {
            console.error('Error searching places:', error);
            // Fallback to local filtering
            const filtered = allPlaces.filter(p =>
                p.name.toLowerCase().includes(value)
            );
            showPlaces(filtered);
        }
    }
});

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
        const response = await fetch('http://localhost:5000/api/favorites', {
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
        // Fallback to localStorage
        let favs = JSON.parse(localStorage.getItem("favorites")) || [];
        if (!favs.some(f => f.id === currentPlace.id)) {
            favs.push(currentPlace);
            localStorage.setItem("favorites", JSON.stringify(favs));
            alert("Added to favorites (local)");
        } else {
            alert("Already in favorites");
        }
    }
}

// Reviews
async function saveReview() {
    const text = document.getElementById("review").value;
    const placeId = document.getElementById('modal').getAttribute('data-place-id');

    if (text.trim() === "") return;

    try {
        const response = await fetch('http://localhost:5000/api/reviews', {
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
        }
    } catch (error) {
        console.error('Error saving review:', error);
        // Fallback to localStorage
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews.push(text);
        localStorage.setItem("reviews", JSON.stringify(reviews));
        document.getElementById("review").value = "";
        loadReviews(placeId);
    }
}

async function loadReviews(placeId) {
    try {
        const response = await fetch(`http://localhost:5000/api/reviews/${placeId}`);
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
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if places exist in global scope (from data.js)
    if (typeof places !== 'undefined') {
        allPlaces = places;
        showPlaces(allPlaces);
    } else {
        loadPlaces();
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            closeModal();
        }
    }
});