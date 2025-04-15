"""Increase field lengths for User and Destination

Revision ID: 057a59a1d169
Revises: 74e4b41d5490
Create Date: 2025-04-14 17:11:20.500281

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '057a59a1d169'
down_revision = '74e4b41d5490'
branch_labels = None
depends_on = None


def upgrade():
    # Alter columns in users table
    op.alter_column('users', 'avatar', existing_type=sa.String(length=200), type_=sa.String(length=500), nullable=True)
    
    # Alter columns in destinations table
    op.alter_column('destinations', 'title', existing_type=sa.String(length=100), type_=sa.String(length=150), nullable=False)
    op.alter_column('destinations', 'location', existing_type=sa.String(length=100), type_=sa.String(length=150), nullable=False)
    op.alter_column('destinations', 'image_url', existing_type=sa.String(length=200), type_=sa.String(length=1000), nullable=True)
    op.alter_column('destinations', 'duration', existing_type=sa.String(length=50), type_=sa.String(length=100), nullable=True)


def downgrade():
    # Revert columns in users table
    op.alter_column('users', 'avatar', existing_type=sa.String(length=500), type_=sa.String(length=200), nullable=True)
    
    # Revert columns in destinations table
    op.alter_column('destinations', 'title', existing_type=sa.String(length=150), type_=sa.String(length=100), nullable=False)
    op.alter_column('destinations', 'location', existing_type=sa.String(length=150), type_=sa.String(length=100), nullable=False)
    op.alter_column('destinations', 'image_url', existing_type=sa.String(length=1000), type_=sa.String(length=200), nullable=True)
    op.alter_column('destinations', 'duration', existing_type=sa.String(length=100), type_=sa.String(length=50), nullable=True)