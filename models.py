from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum

db = SQLAlchemy()

# Association tables for many-to-many relationships
user_badges = db.Table('user_badges',
    db.Column('user_id', db.String(255), db.ForeignKey('users.user_id'), primary_key=True),
    db.Column('badge_id', db.String(255), db.ForeignKey('badges.badge_id'), primary_key=True)
)

user_signed_up_to_events = db.Table('user_signed_up_to_events',
    db.Column('user_id', db.String(255), db.ForeignKey('users.user_id'), primary_key=True),
    db.Column('event_id', db.Integer(), db.ForeignKey('events.event_id'), primary_key=True)
)

user_completed_events = db.Table('user_completed_events',
    db.Column('user_id', db.String(255), db.ForeignKey('users.user_id'), primary_key=True),
    db.Column('event_id', db.Integer(), db.ForeignKey('events.event_id'), primary_key=True)
)

user_hosted_events = db.Table('user_hosted_events',
    db.Column('user_id', db.String(255), db.ForeignKey('users.user_id'), primary_key=True),
    db.Column('event_id', db.Integer(), db.ForeignKey('events.event_id'), primary_key=True)
)

event_badges = db.Table('event_badges',
    db.Column('event_id', db.Integer(), db.ForeignKey('events.event_id'), primary_key=True),
    db.Column('badge_id', db.String(255), db.ForeignKey('badges.badge_id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.String(255), primary_key=True, unique=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    badges = db.relationship('Badge', secondary=user_badges, backref=db.backref('users', lazy='dynamic'))
    completed_events = db.relationship('Event', secondary=user_completed_events, backref=db.backref('completed_by', lazy='dynamic'))
    signed_up_to = db.relationship('Event', secondary=user_signed_up_to_events, backref=db.backref('signed_up_to', lazy='dynamic'))
    hosted_events = db.relationship('Event', secondary=user_hosted_events, backref=db.backref('hosted_by', lazy='dynamic'))
    achievements = db.relationship('Achievement', backref='user', lazy=True)

class Event(db.Model):
    __tablename__ = 'events'
    event_id = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    badges = db.relationship('Badge', secondary=event_badges, backref=db.backref('events', lazy='dynamic'))
    status = db.Column(Enum('before', 'ongoing', 'completed', name='status_enum'), nullable=False, default="before")
    date_start = db.Column(db.Date, nullable=False)
    date_end = db.Column(db.Date, nullable=False)

class Badge(db.Model):
    __tablename__ = 'badges'
    badge_id = db.Column(db.String(255), primary_key=True, unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)

class Achievement(db.Model):
    __tablename__ = 'achievements'
    achievement_id = db.Column(db.String(255), primary_key=True, unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.String(255), db.ForeignKey('users.user_id'), nullable=False)
    badge_id = db.Column(db.String(255), db.ForeignKey('badges.badge_id'), nullable=False)
    no_to_completion = db.Column(db.Integer, nullable=False)
    progress = db.Column(db.Integer, nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
