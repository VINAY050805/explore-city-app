# 🌆 Explore Your City – Full Stack Application

A full-stack web application for exploring city attractions with favorites and reviews functionality.

---

## ✨ Features

- Browse places by category (Food, Culture, Nature, Shopping)
- Search places by name
- View detailed information about each place
- Add places to favorites
- Write and view reviews for places
- Persistent storage using SQLite database

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Flask (Python) |
| Database | SQLite + SQLAlchemy ORM |

---

## 📁 Project Structure

```bash
explore-city-app/
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── favorites.html
│   ├── style.css
│   ├── script.js
│   └── images/
│       ├── mysore_palace.jpg
│       ├── brindavan_gardens.jpg
│       ├── chamundi_hills.jpg
│       ├── church.jpg
│       ├── zoo.jpg
│       ├── market.jpg
│       ├── rrr_restaurant.jpg
│       ├── krs_dam.jpg
│       └── mall_of_mysore.jpg
│
├── run.py
└── README.md
```


---

## ⚙️ Prerequisites

- Python 3.8 or higher
- pip
- Modern web browser

---

## 🚀 Installation

### Clone Repository

git clone https://github.com/yourusername/explore-city-app.git  
cd explore-city-app

### Create Virtual Environment

Windows:
python -m venv venv  
venv\Scripts\activate  

macOS/Linux:
python3 -m venv venv  
source venv/bin/activate

### Install Dependencies

cd backend  
pip install -r requirements.txt

---

## 🔧 Configuration

### backend/requirements.txt

Flask==2.3.3  
Flask-CORS==4.0.0  
Flask-SQLAlchemy==3.0.5

### run.py

from backend.app import app

if __name__ == "__main__":
    app.run(debug=True, port=5000)

---

## ▶️ Running the Application

python run.py

Open browser:  
http://localhost:5000

---

## 🔌 API Endpoints

### Places

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/places | Get all places |
| GET | /api/places?category=Food | Filter by category |
| GET | /api/places/search?q=palace | Search by name |
| GET | /api/places/{id} | Get place details |

### Favorites

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/favorites | Get favorites |
| POST | /api/favorites | Add favorite |
| DELETE | /api/favorites/{place_id} | Remove favorite |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/reviews/{place_id} | Get reviews |
| POST | /api/reviews | Add review |

---

## 🗄 Database Schema

### Place Table

CREATE TABLE place (
id INTEGER PRIMARY KEY,
name VARCHAR(100) NOT NULL,
category VARCHAR(50) NOT NULL,
image VARCHAR(200) NOT NULL,
description TEXT NOT NULL
);

### Favorite Table

CREATE TABLE favorite (
id INTEGER PRIMARY KEY,
place_id INTEGER NOT NULL,
created_at DATETIME,
FOREIGN KEY(place_id) REFERENCES place(id)
);

### Review Table

CREATE TABLE review (
id INTEGER PRIMARY KEY,
place_id INTEGER NOT NULL,
content TEXT NOT NULL,
created_at DATETIME,
FOREIGN KEY(place_id) REFERENCES place(id)
);

---

## 📖 Usage Guide

### Browsing Places

1. Open home page  
2. Filter using category buttons  
3. Search using search bar  
4. Click **View Details**

### Managing Favorites

1. Click **Add to Favorites**
2. Open **View Favorites ⭐**
3. Remove using **Remove ⭐**

### Writing Reviews

1. Open place details  
2. Write review  
3. Click **Submit**

---

## 🛠 Troubleshooting

### Not Found Error
- Ensure backend runs on port 5000
- Run run.py from root directory

### Database Not Creating
- Delete backend/instance/explore_city.db and restart

### Images Not Loading
- Check frontend/images folder
- Paths must start with /images/

### Port Already in Use

Windows:
netstat -ano | findstr :5000  
taskkill /PID <PID> /F  

macOS/Linux:
lsof -i :5000  
kill -9 <PID>

---

## 📍 Sample Data

- Mysore Palace  
- Brindavan Gardens  
- Chamundi Hills  
- St. Philomena's Church  
- Mysore Zoo  
- Devaraja Market  
- RRR Restaurant  
- KRS Dam  
- Mall of Mysore  

---

## 🤝 Contributing

git checkout -b feature/AmazingFeature  
git commit -m "Add AmazingFeature"  
git push origin feature/AmazingFeature  

Open a Pull Request 🚀


---

## 📬 Contact

Author: ATME SMG Interns   
---

## 🙌 Acknowledgments

Flask Documentation  
SQLAlchemy Documentation  
All contributors ❤️

---

Made with ❤️ for city explorers everywhere
