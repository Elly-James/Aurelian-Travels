from datetime import datetime
from extensions import db, bcrypt

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    avatar = db.Column(db.String(500))  # Increased to handle longer URLs
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        if password:
            self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        if not self.password_hash:
            return False
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'avatar': self.avatar or 'https://www.gravatar.com/avatar/default?s=200&d=mp'
        }

class Destination(db.Model):
    __tablename__ = 'destinations'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)  # Increased for longer titles
    location = db.Column(db.String(150), nullable=False)  # Increased for complex locations
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(1000))  # Increased to handle long URLs
    fees = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'kenyan' or 'international'
    is_package = db.Column(db.Boolean, default=False)
    duration = db.Column(db.String(100))  # Increased for detailed durations
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'location': self.location,
            'description': self.description,
            'image_url': self.image_url,
            'fees': self.fees,
            'type': self.type,
            'is_package': self.is_package,
            'duration': self.duration
        }

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False)
    travel_date = db.Column(db.Date, nullable=False)
    return_date = db.Column(db.Date)
    adults = db.Column(db.Integer, default=1)
    children = db.Column(db.Integer, default=0)
    special_requests = db.Column(db.Text)
    contact_info = db.Column(db.JSON)  # Stores firstName, lastName, email, phone
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'destination_id': self.destination_id,
            'travel_date': self.travel_date.isoformat(),
            'return_date': self.return_date.isoformat() if self.return_date else None,
            'adults': self.adults,
            'children': self.children,
            'special_requests': self.special_requests,
            'contact_info': self.contact_info or {}
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'destination_id': self.destination_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat()
        }