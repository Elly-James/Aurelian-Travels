import os
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask_jwt_extended import (
    create_access_token, 
    jwt_required, 
    get_jwt_identity,
    create_refresh_token,
    get_jwt
)
from flask_cors import CORS
from extensions import db, migrate, jwt, bcrypt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests

def create_app():
    app = Flask(__name__)

    # Load environment variables
    load_dotenv()

    # App configurations
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    # Use RENDER_DATABASE_URL if available (on Render), otherwise fall back to DATABASE_URL (local)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('RENDER_DATABASE_URL') or os.getenv('DATABASE_URL', 'sqlite:///app.db').replace('postgres://', 'postgresql://')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                os.getenv('FRONTEND_URL', 'http://localhost:3000'),
                "https://aurelian-travels-frontend.onrender.com"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "supports_credentials": True,
            "max_age": 86400
        }
    })

    # Token blacklist storage (in-memory for simplicity)
    blacklisted_tokens = set()

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload['jti']
        return jti in blacklisted_tokens

    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to the Aurelian Travels API! Use /api endpoints to interact with the API."})

    # Temporary test endpoint to confirm deployment
    @app.route('/api/test', methods=['GET'])
    def test_endpoint():
        return jsonify({"message": "Test endpoint is working! This confirms the latest app.py is deployed."})

    # Debug endpoint to confirm the version of app.py
    @app.route('/api/debug', methods=['GET'])
    def debug_endpoint():
        return jsonify({"message": "This is app.py version with /api/test and /api/seed endpoints"})

    # AUTHENTICATION ROUTES
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        from models import User
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already registered"}), 400

        user = User(
            email=data['email'],
            name=data.get('name', 'User'),
            avatar=data.get('avatar')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 201

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        from models import User
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400

        user = User.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            return jsonify({"error": "Invalid credentials"}), 401

        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        })

    @app.route('/api/auth/google', methods=['POST'])
    def google_login():
        from models import User
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid request data"}), 400

        code = data.get('code')
        if not code:
            return jsonify({"error": "Google authorization code is required"}), 400

        try:
            client_id = os.getenv('GOOGLE_CLIENT_ID')
            client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
            redirect_uri = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:3000')
            
            token_url = "https://oauth2.googleapis.com/token"
            token_data = {
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code',
            }
            
            headers = {'Content-Type': 'application/x-www-form-urlencoded'}
            token_response = requests.post(token_url, data=token_data, headers=headers, timeout=10)
            token_response_json = token_response.json()

            if token_response.status_code != 200:
                error_msg = token_response_json.get('error_description', 'Unknown error')
                return jsonify({"error": "Failed to authenticate with Google", "details": error_msg}), 400

            id_token_str = token_response_json.get('id_token')
            access_token = token_response_json.get('access_token')
            
            if not id_token_str or not access_token:
                return jsonify({"error": "Invalid response from Google"}), 400

            try:
                id_info = id_token.verify_oauth2_token(id_token_str, google_requests.Request(), client_id)
            except ValueError as e:
                return jsonify({"error": "Invalid Google token", "details": str(e)}), 400

            email = id_info.get('email')
            if not email:
                return jsonify({"error": "Email not provided by Google"}), 400

            name = id_info.get('name', 'Google User')
            picture = id_info.get('picture', 'https://www.gravatar.com/avatar/default?s=200&d=mp')

            user = User.query.filter_by(email=email).first()
            if not user:
                user = User(email=email, name=name, avatar=picture, password_hash=None)
                db.session.add(user)
                db.session.commit()

            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)

            return jsonify({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user.to_dict()
            })

        except Exception as e:
            return jsonify({"error": "Failed to process Google login", "details": str(e)}), 500

    @app.route('/api/auth/logout', methods=['POST'])
    @jwt_required()
    def logout():
        jti = get_jwt()['jti']
        blacklisted_tokens.add(jti)
        return jsonify({"message": "Successfully logged out"}), 200

    @app.route('/api/auth/apple', methods=['POST'])
    def apple_login():
        from models import User
        data = request.get_json()

        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid request data"}), 400

        id_token_str = data.get('id_token')
        if not id_token_str:
            return jsonify({"error": "Apple ID token is required"}), 400

        try:
            import jwt as pyjwt
            decoded = pyjwt.decode(id_token_str, options={"verify_signature": False})
            apple_public_keys = requests.get('https://appleid.apple.com/auth/keys').json()
            key = None
            for k in apple_public_keys['keys']:
                if k['kid'] == decoded['kid']:
                    key = k
                    break

            if not key:
                return jsonify({"error": "Failed to find matching Apple public key"}), 400

            from pyjwt.algorithms import RSAAlgorithm
            public_key = RSAAlgorithm.from_jwk(key)
            decoded = pyjwt.decode(id_token_str, public_key, algorithms=['RS256'], audience=os.getenv('APPLE_CLIENT_ID'))

            email = decoded.get('email')
            if not email:
                return jsonify({"error": "Email not provided by Apple"}), 400

            name = f"{data.get('firstName', '')} {data.get('lastName', '')}".strip() or 'Apple User'
            picture = 'https://www.gravatar.com/avatar/default?s=200&d=mp'

            user = User.query.filter_by(email=email).first()
            if not user:
                user = User(email=email, name=name, avatar=picture, password_hash=None)
                db.session.add(user)
                db.session.commit()

            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)

            return jsonify({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user.to_dict()
            })

        except Exception as e:
            return jsonify({"error": "Failed to process Apple login", "details": str(e)}), 500

    @app.route('/api/auth/refresh', methods=['POST'])
    @jwt_required(refresh=True)
    def refresh():
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user)
        return jsonify({'access_token': new_token})

    # DESTINATION ROUTES
    @app.route('/api/destinations', methods=['GET'])
    def get_destinations():
        from models import Destination, Review
        params = request.args
        query = Destination.query

        if 'type' in params:
            query = query.filter_by(type=params['type'])

        if 'is_package' in params:
            is_package = params['is_package'].lower() == 'true'
            query = query.filter_by(is_package=is_package)

        destinations = query.all()
        destinations_data = []
        for d in destinations:
            dest_dict = d.to_dict()
            reviews = Review.query.filter_by(destination_id=d.id).all()
            dest_dict['reviews'] = [r.to_dict() for r in reviews]
            destinations_data.append(dest_dict)
        return jsonify(destinations_data)

    @app.route('/api/destinations/<int:id>', methods=['GET'])
    def get_destination():
        from models import Destination, Review
        destination = Destination.query.get_or_404(id)
        destination_data = destination.to_dict()
        reviews = Review.query.filter_by(destination_id=id).all()
        destination_data['reviews'] = [r.to_dict() for r in reviews]
        return jsonify(destination_data)

    @app.route('/api/destinations/search', methods=['GET'])
    def search_destinations():
        from models import Destination
        params = request.args
        query = Destination.query

        if 'q' in params:
            search_term = f"%{params['q']}%"
            query = query.filter(
                (Destination.title.ilike(search_term)) | 
                (Destination.location.ilike(search_term))
            )

        if 'max_price' in params:
            query = query.filter(Destination.fees <= float(params['max_price']))

        destinations = query.all()
        return jsonify([d.to_dict() for d in destinations])

    @app.route('/api/destinations/suggest', methods=['POST'])
    def suggest_destination():
        from models import DestinationSuggestion, Destination, User
        data = request.get_json()
        
        required_fields = ['title', 'location', 'description', 'fees', 'type', 'is_package']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        if data['type'] not in ['kenyan', 'international']:
            return jsonify({"error": "Type must be 'kenyan' or 'international'"}), 400

        user_id = None
        try:
            user_id = get_jwt_identity()
        except:
            pass

        suggestion = DestinationSuggestion(
            user_id=user_id,
            title=data['title'],
            location=data['location'],
            description=data['description'],
            image_url=data.get('image_url', 'https://via.placeholder.com/300'),
            fees=float(data['fees']),
            type=data['type'],
            is_package=data['is_package'],
            duration=data.get('duration', '')
        )
        
        destination = Destination(
            title=data['title'],
            location=data['location'],
            description=data['description'],
            image_url=data.get('image_url', 'https://via.placeholder.com/300'),
            fees=float(data['fees']),
            type=data['type'],
            is_package=data['is_package'],
            duration=data.get('duration', '')
        )

        db.session.add(suggestion)
        db.session.add(destination)
        db.session.commit()
        
        return jsonify(destination.to_dict()), 201

    @app.route('/api/destinations/<int:destination_id>/reviews', methods=['POST'])
    @jwt_required()
    def submit_review(destination_id):
        from models import Review, Destination, User
        data = request.get_json()
        user_id = get_jwt_identity()
        
        destination = Destination.query.get_or_404(destination_id)
        
        if 'rating' not in data or not (1 <= data['rating'] <= 5):
            return jsonify({"error": "Rating must be between 1 and 5"}), 400
        
        review = Review(
            user_id=user_id,
            destination_id=destination_id,
            rating=data['rating'],
            comment=data.get('comment', '')
        )
        
        db.session.add(review)
        db.session.commit()
        
        review_data = review.to_dict()
        user = User.query.get(user_id)
        review_data['user_name'] = user.name if user else 'Anonymous'
        review_data['user_avatar'] = user.avatar if user else None
        
        return jsonify(review_data), 201

    @app.route('/api/destinations/<int:destination_id>/reviews', methods=['GET'])
    def get_reviews(destination_id):
        from models import Review, Destination, User
        destination = Destination.query.get_or_404(destination_id)
        
        reviews = Review.query.filter_by(destination_id=destination_id).all()
        reviews_data = []
        for review in reviews:
            review_data = review.to_dict()
            user = User.query.get(review.user_id)
            review_data['user_name'] = user.name if user else 'Anonymous'
            review_data['user_avatar'] = user.avatar if user else None
            reviews_data.append(review_data)
            
        return jsonify(reviews_data)

    # BOOKING ROUTES
    @app.route('/api/bookings', methods=['GET'])
    @jwt_required()
    def get_user_bookings():
        from models import Booking, Destination
        user_id = get_jwt_identity()
        bookings = Booking.query.filter_by(user_id=user_id).all()
        
        bookings_data = []
        for booking in bookings:
            booking_data = booking.to_dict()
            destination = Destination.query.get(booking.destination_id)
            if destination:
                booking_data['destination'] = destination.to_dict()
            bookings_data.append(booking_data)
            
        return jsonify(bookings_data)

    @app.route('/api/bookings', methods=['POST'])
    @jwt_required()
    def create_booking():
        from models import Booking
        data = request.get_json()
        user_id = get_jwt_identity()
        
        try:
            travel_date = datetime.strptime(data['travel_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid travel_date format. Use YYYY-MM-DD"}), 400

        return_date = None
        if 'return_date' in data and data['return_date']:
            try:
                return_date = datetime.strptime(data['return_date'], '%Y-%m-%d').date()
                if return_date < travel_date:
                    return jsonify({"error": "Return date cannot be before travel date"}), 400
            except ValueError:
                return jsonify({"error": "Invalid return_date format. Use YYYY-MM-DD"}), 400

        booking = Booking(
            user_id=user_id,
            destination_id=data['destination_id'],
            travel_date=travel_date,
            return_date=return_date,
            adults=data.get('adults', 1),
            children=data.get('children', 0),
            special_requests=data.get('special_requests', ''),
            contact_info={
                'firstName': data.get('firstName', ''),
                'lastName': data.get('lastName', ''),
                'email': data.get('email', ''),
                'phone': data.get('phone', '')
            }
        )
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify(booking.to_dict()), 201

    @app.route('/api/bookings/<int:id>', methods=['DELETE'])
    @jwt_required()
    def cancel_booking(id):
        from models import Booking
        user_id = get_jwt_identity()
        booking = Booking.query.filter_by(id=id, user_id=user_id).first_or_404()
        
        db.session.delete(booking)
        db.session.commit()
        
        return jsonify({"message": "Booking cancelled successfully"}), 200

    # SEEDING ENDPOINT
    @app.route('/api/seed', methods=['POST'])
    def seed_database_endpoint():
        from models import Destination
        from seed import seed_database
        
        # Optional: Add a secret key to restrict access
        data = request.get_json()
        secret_key = data.get('secret_key') if data else None
        expected_key = os.getenv('SEED_SECRET_KEY', 'my-secret-key')

        if secret_key != expected_key:
            return jsonify({"error": "Unauthorized: Invalid secret key"}), 401

        try:
            # Check if the database already has data
            if Destination.query.first():
                return jsonify({"message": "Database already seeded"}), 200

            seed_database()
            return jsonify({"message": "Database seeded successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Failed to seed database: {str(e)}"}), 500

    # Create database tables on startup
    with app.app_context():
        # Test database connection
        try:
            db.engine.connect()
            print("✔️ Successfully connected to the database")
        except Exception as e:
            print(f"❌ Failed to connect to the database: {str(e)}")
            raise e  # Raise the exception to fail the deployment and log the error

        # Import all models to ensure they are registered with SQLAlchemy
        from models import User, Destination, DestinationSuggestion, Review, Booking
        try:
            db.create_all()
            print("✔️ Database tables created")
        except Exception as e:
            print(f"❌ Failed to create database tables: {str(e)}")

        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"Tables in database after db.create_all(): {tables}")

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))