from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__, static_folder='../frontend')
CORS(app)

# Get the absolute path of the current file
basedir = os.path.abspath(os.path.dirname(__file__))

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'explore_city.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Ensure instance folder exists
os.makedirs(os.path.join(basedir, 'instance'), exist_ok=True)

db = SQLAlchemy(app)

# Database Models
class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    favorites = db.relationship('Favorite', backref='place', lazy=True)
    reviews = db.relationship('Review', backref='place', lazy=True)

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place_id = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Initialize database with sample data
def init_db():
    with app.app_context():
        db.create_all()
        
        if Place.query.count() == 0:
            sample_places = [
                {
                    "name": "Mysore Palace",
                    "category": "Culture",
                    "image": "/images/mysore_palace.jpg",
                    "description": "Famous royal palace and major tourist attraction"
                },
                {
                    "name": "Brindavan Gardens",
                    "category": "Nature",
                    "image": "/images/brindavan_gardens.jpg",
                    "description": "Beautiful garden with musical fountain"
                },
                {
                    "name": "Chamundi Hills",
                    "category": "Nature",
                    "image": "/images/chamundi_hills.jpg",
                    "description": "Hilltop temple with city view"
                },
                {
                    "name": "St. Philomena's Church",
                    "category": "Culture",
                    "image": "/images/church.jpg",
                    "description": "One of the tallest churches in India"
                },
                {
                    "name": "Mysore Zoo",
                    "category": "Nature",
                    "image": "/images/zoo.jpg",
                    "description": "One of the oldest zoos in India"
                },
                {
                    "name": "Devaraja Market",
                    "category": "Shopping",
                    "image": "/images/market.jpg",
                    "description": "Local market famous for flowers and spices"
                },
                {
                    "name": "RRR Restaurant",
                    "category": "Food",
                    "image": "/images/rrr_restaurant.jpg",
                    "description": "Popular for authentic Mysore meals"
                },
                {
                    "name": "KRS Dam",
                    "category": "Nature",
                    "image": "/images/krs_dam.jpg",
                    "description": "Scenic dam near Mysore city"
                },
                {
                    "name": "Mall of Mysore",
                    "category": "Shopping",
                    "image": "/images/mall_of_mysore.jpg",
                    "description": "Popular shopping mall with entertainment"
                }
            ]
            
            for place_data in sample_places:
                place = Place(**place_data)
                db.session.add(place)
            
            db.session.commit()
            print("Database initialized with sample data!")

# API Routes
@app.route('/api/places', methods=['GET'])
def get_places():
    """Get all places with optional category filter"""
    category = request.args.get('category')
    
    if category and category != 'All':
        places = Place.query.filter_by(category=category).all()
    else:
        places = Place.query.all()
    
    return jsonify([{
        'id': place.id,
        'name': place.name,
        'category': place.category,
        'image': place.image,
        'desc': place.description
    } for place in places])

@app.route('/api/places/search', methods=['GET'])
def search_places():
    """Search places by name"""
    query = request.args.get('q', '')
    
    if query:
        places = Place.query.filter(Place.name.ilike(f'%{query}%')).all()
    else:
        places = Place.query.all()
    
    return jsonify([{
        'id': place.id,
        'name': place.name,
        'category': place.category,
        'image': place.image,
        'desc': place.description
    } for place in places])

@app.route('/api/places/<int:place_id>', methods=['GET'])
def get_place(place_id):
    """Get a specific place by ID"""
    place = Place.query.get_or_404(place_id)
    return jsonify({
        'id': place.id,
        'name': place.name,
        'category': place.category,
        'image': place.image,
        'desc': place.description
    })

# Favorites endpoints
@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    """Get all favorites"""
    favorites = Favorite.query.all()
    return jsonify([{
        'id': fav.place.id,
        'name': fav.place.name,
        'category': fav.place.category,
        'image': fav.place.image,
        'desc': fav.place.description
    } for fav in favorites])

@app.route('/api/favorites', methods=['POST'])
def add_favorite():
    """Add a place to favorites"""
    data = request.json
    place_id = data.get('place_id')
    
    # Check if already in favorites
    existing = Favorite.query.filter_by(place_id=place_id).first()
    if existing:
        return jsonify({'message': 'Already in favorites'}), 400
    
    favorite = Favorite(place_id=place_id)
    db.session.add(favorite)
    db.session.commit()
    
    return jsonify({'message': 'Added to favorites successfully'}), 201

@app.route('/api/favorites/<int:place_id>', methods=['DELETE'])
def remove_favorite(place_id):
    """Remove a place from favorites"""
    favorite = Favorite.query.filter_by(place_id=place_id).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({'message': 'Removed from favorites'})
    return jsonify({'message': 'Favorite not found'}), 404

# Reviews endpoints
@app.route('/api/reviews/<int:place_id>', methods=['GET'])
def get_reviews(place_id):
    """Get all reviews for a place"""
    reviews = Review.query.filter_by(place_id=place_id).order_by(Review.created_at.desc()).all()
    return jsonify([{
        'id': review.id,
        'content': review.content,
        'created_at': review.created_at.isoformat()
    } for review in reviews])

@app.route('/api/reviews', methods=['POST'])
def add_review():
    """Add a review for a place"""
    data = request.json
    place_id = data.get('place_id')
    content = data.get('content')
    
    if not content or not content.strip():
        return jsonify({'message': 'Review content cannot be empty'}), 400
    
    review = Review(place_id=place_id, content=content.strip())
    db.session.add(review)
    db.session.commit()
    
    return jsonify({
        'id': review.id,
        'content': review.content,
        'created_at': review.created_at.isoformat()
    }), 201

# Serve frontend files
@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_frontend(path):
    if path.endswith('.html') or path.endswith('.css') or path.endswith('.js'):
        return send_from_directory('../frontend', path)
    return send_from_directory('../frontend', path)

if __name__ == '__main__':
    init_db()
    print("Server running at http://localhost:5000")
    app.run(debug=True, port=5000)