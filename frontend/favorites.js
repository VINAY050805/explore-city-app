async function loadFavorites() {
    const res = await fetch("http://127.0.0.1:5000/favorites");
    const places = await res.json();

    const container = document.getElementById("places");
    container.innerHTML = "";

    places.forEach(place => {
        container.innerHTML += `
        <div class="card">
            <img src="${place.image}">
            <h3>${place.name}</h3>
            <button onclick="removeFav('${place._id}')">Remove</button>
        </div>`;
    });
}

async function removeFav(id) {
    await fetch(`http://127.0.0.1:5000/favorites/${id}`, {method:"DELETE"});
    loadFavorites();
}

loadFavorites();
