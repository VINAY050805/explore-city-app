let currentPlace;
let allPlaces = [];

// Get the base URL for API calls
const API_BASE_URL = 'http://localhost:5000';

// Load places from backend
async function loadPlaces(category = 'All') {
    try {
        let url = `${API_BASE_URL}/api/places`;
        if (category !== 'All') {
            url += `?category=${category}`;
        }
        
        console.log('Fetching from:', url); // Debug log
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allPlaces = await response.json();
        showPlaces(allPlaces);
    } catch (error) {
        console.error('Error loading places:', error);
        document.getElementById("places").innerHTML = `<p style="text-align: center; color: red;">Error loading places. Make sure the backend server is running at ${API_BASE_URL}</p>`;
    }
}

function showPlaces(list) {
    const container = document.getElementById("places");
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<p style='text-align: center; width: 100%;'>No places found</p>";
        return;
    }

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
            const response = await fetch(`${API_BASE_URL}/api/places/search?q=${value}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const filtered = await response.json();
            showPlaces(filtered);
        } catch (error) {
            console.error('Error searching places:', error);
        }
    }
});

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
        const response = await fetch(`${API_BASE_URL}/api/favorites`, {
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
        alert('Error adding to favorites. Please try again.');
    }
}

// Reviews
async function saveReview() {
    const text = document.getElementById("review").value;
    const placeId = document.getElementById('modal').getAttribute('data-place-id');

    if (text.trim() === "") return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/reviews`, {
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
        } else {
            const data = await response.json();
            alert(data.message || 'Error saving review');
        }
    } catch (error) {
        console.error('Error saving review:', error);
    }
}

async function loadReviews(placeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${placeId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPlaces();
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            closeModal();
        }
    }
});