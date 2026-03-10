import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

def get_database_url():
    """Get and fix the database URL for SQLAlchemy + Render compatibility."""
    url = os.getenv('DATABASE_URL', '')
    # Render still sometimes gives 'postgres://' — SQLAlchemy needs 'postgresql://'
    url = url.replace('postgres://', 'postgresql://')
    # Ensure SSL is required (critical for Render Postgres)
    if url and 'sslmode' not in url:
        separator = '&' if '?' in url else '?'
        url = f"{url}{separator}sslmode=require"
    return url

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

    SQLALCHEMY_DATABASE_URI = get_database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        # Free tier Render Postgres allows max ~25 connections total.
        # Keep pool small to avoid hitting the limit.
        'pool_size': 2,
        'max_overflow': 3,
        'pool_recycle': 180,       # Recycle connections every 3 min (avoids stale SSL)
        'pool_pre_ping': True,     # Test connection before using it from pool
        'pool_timeout': 30,
        'connect_args': {
            'sslmode': 'require',
            'connect_timeout': 10,
        }
    }

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ['headers', 'cookies']
    JWT_COOKIE_SECURE = os.getenv('FLASK_ENV') == 'production'

    # OAuth Configs
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')
    APPLE_CLIENT_ID = os.getenv('APPLE_CLIENT_ID')
    FRONTEND_URL = os.getenv('FRONTEND_URL')


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_ENGINE_OPTIONS = {
        # Looser settings for local dev (no SSL needed locally)
        'pool_size': 5,
        'max_overflow': 10,
        'pool_recycle': 300,
        'pool_pre_ping': True,
    }


class ProductionConfig(Config):
    DEBUG = False
    PROPAGATE_EXCEPTIONS = True


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}