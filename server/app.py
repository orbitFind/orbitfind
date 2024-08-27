
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from datetime import date, datetime
import os
from flask import Flask, request, jsonify
from config import Config
from models import db, User, Event, Badge, Achievement
import firebase_admin
from firebase_admin import auth
from firebase_setup import initialize_firebase
from flask_migrate import Migrate
import uuid
from flask_cors import CORS
from utils import verify_user
from werkzeug.exceptions import NotFound


app = Flask(__name__)

app.config['FIREBASE_WEB_API_KEY'] = os.getenv('FIREBASE_WEB_API_KEY')

CORS(app)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

initialize_firebase()

with app.app_context():
    db.create_all()

# !!!! Work on:
# Changing the method of getting user id (not in dynamic url, but through firebase authorization somehow)

# !!!! How to run app:
# (I don't know if neccessary step, DO ONLY IF DOESN'T WORK) Download mysql from internet: https://dev.mysql.com/downloads/installer/
# (Might be neccesary) to select interpreter to the ./myenv/Scripts/python.exe 
# go to folder Flask and type >python app.py
# Download app postman
# In postman run: http://127.0.0.1:5000/... (replace ... with the correct url: /users, /events)
# To see all users or events run url with /events or /users and POST method
# To see one record type correct url with /<id> and GET method
# To create a new event, choose POST method with url /events and in body tab paste:
# To create a new user first text me so I can add new user to firebase, then run put method with url /users/<id> (I will provie user id) and in body specify "full_name"
# To delete user or event run correct url with /<id> and DELETE method 

# Syncronise users from firebase databse to MySQL database
@app.route('/sync_users', methods=['POST'])
def sync_users():
    try:
        users = []
        page = auth.list_users()
        while page:
            for user in page.users:
                if user.email is None:
                    continue
                users.append({
                    'user_id': user.uid,
                    'username': user.display_name or user.email or ' ', 
                    'full_name': user.display_name or '',         
                    'email': user.email
                })
            if page.next_page_token:
                page = auth.list_users(page_token=page.next_page_token)
            else:
                break

        # Sync users with MySQL
        for user in users:
            # Check if user already exists
            existing_user = User.query.get(user['user_id'])
            if not existing_user:
                new_user = User(
                    user_id=user['user_id'],
                    username=user['username'],
                    full_name=user['full_name'],
                    email=user['email'],
                )
                db.session.add(new_user)
                db.session.commit()

        # To retrieve this on the frontend, do response.json() and then get the key 'message'.
        return jsonify({'message': 'Users synced successfully'}), 200
    except Exception as e:
        # To retrieve this on the frontend, do response.json() and then get the key 'error'.
        return jsonify({'error': str(e)}), 500

# Read all users
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    # To retrieve this on the frontend, do response.json() and then get the key 'data'.
    return jsonify({"data": [{'user_id': user.user_id, 'username': user.username, "full_name": user.full_name, 'email': user.email} for user in users]}), 200

# Read one user
@app.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    try:
        auth_token = request.headers.get('Authorization')
        refresh_token = request.headers.get('RefreshToken')

        # Verify the user
        user = verify_user(auth_token, refresh_token, app.config['FIREBASE_WEB_API_KEY'])

        if not user:
            return jsonify({'error': "Authentication failed"}), 401
        
        # ! Commented out for testing purposes
        # if user.user_id != id:
        #     return jsonify({'error': 'User is not authorized to view this user'}), 403
        
        user = User.query.get_or_404(id)
        return jsonify({'user_id': user.user_id, 'username': user.username, "full_name": user.full_name, 'email': user.email}), 200
    except NotFound:
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Finish user (put the full name, which firebase does not provide - firebase provides email, username and user_id)
@app.route('/users/<string:id>', methods=['PUT'])
def finish_user(id):
    try:
        auth_token = request.headers.get('Authorization')
        refresh_token = request.headers.get('RefreshToken')

        # Verify the user
        user = verify_user(auth_token, refresh_token, app.config['FIREBASE_WEB_API_KEY'])

        if not user:
            return jsonify({'error': "Authentication failed"}), 401
        
        # ! Commented out for testing purposes
        # if user.user_id != id:
        #     return jsonify({'error': 'User is not authorized to update this user'}), 403

        data = request.get_json()
        user = User.query.get_or_404(id)
        
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            user.email = data['email']
        if 'username' in data:
            user.username = data['username']
        if 'password' in data:
            user.password = data['password']

        db.session.commit()

        # To retrieve this on the frontend, do response.json() and then get the key 'data' and 'message'.
        return jsonify({
            'data': user,
            'message': 'User updated successfully'
            }), 201
    except NotFound:
        # To retrieve this on the frontend, do response.json() and then get the key 'error'.
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        # To retrieve this on the frontend, do response.json() and then get the key 'error'.
        return jsonify({'error': str(e)}), 500

# Delete user
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        auth_token = request.headers.get('Authorization')
        refresh_token = request.headers.get('RefreshToken')

        # Verify the user
        user = verify_user(auth_token, refresh_token, app.config['FIREBASE_WEB_API_KEY'])

        if not user:
            return jsonify({'error': 'Authentication failed'}), 401
        
        # ! Commented out for testing purposes
        # if user.user_id != id:
        #     return jsonify({'error': 'User is not authorized to delete this user'}), 403
        
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()

        # To retrieve this on the frontend, do response.json() and then get the key 'message'.
        return jsonify({'message': 'User deleted successfully'}), 200
    except NotFound:
        # To retrieve this on the frontend, do response.json() and then get the key 'error'.
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        # To retrieve this on the frontend, do response.json() and then get the key 'error'.
        return jsonify({'error': str(e)}), 500

# --- EVENTS ---

# Create event
@app.route('/events', methods=['POST'])
def create_event():
    try:
        auth_token = request.headers.get('Authorization')
        refresh_token = request.headers.get('Refreshtoken')

        # Verify the user
        user = verify_user(auth_token, refresh_token, app.config['FIREBASE_WEB_API_KEY'])

        if not user:
            return jsonify("Authentication failed"), 401
        
        # After successfully verifying the user, we can create the event
        data = request.get_json()

        # Convert date strings to datetime objects
        date_start = datetime.strptime(data['date_start'], '%Y-%m-%dT%H:%M:%S.%fZ')
        date_end = datetime.strptime(data['date_end'], '%Y-%m-%dT%H:%M:%S.%fZ')
        
        # Format datetime objects to MySQL compatible string format
        date_start_str = date_start.strftime('%Y-%m-%d %H:%M:%S')
        date_end_str = date_end.strftime('%Y-%m-%d %H:%M:%S')

        new_event = Event(
            name = data['name'],
            description = data['description'],
            date_start = date_start_str,
            date_end = date_end_str,
            region=data["region"],
            location=data["location"],
            tags=list(data["tags"]),
            status=data["status"],
            hosted_users=[user.user_id])
        if "badges" in data:
            new_event.badges = data["badges"]
        db.session.add(new_event)
        db.session.commit()

        # To retrieve this on the frontend, do response.json() and then get the key 'message'.
        return jsonify({'message': 'Event created successfully'}), 201
    except Exception as e:
        # To retrieve this on the frontend, do response.json() and then get the key 'error'.
        return jsonify(str(e)), 500
        

# Update event
@app.route('/events/<int:id>', methods=['PUT'])
def update_event(id):
    try:
        auth_token = request.headers.get('Authorization')
        refresh_token = request.headers.get('Refreshtoken')

        # Verify the user
        user = verify_user(auth_token, refresh_token, app.config['FIREBASE_WEB_API_KEY'])

        if not user:
            return jsonify("Authentication failed"), 401

        data = request.get_json()
        event = Event.query.get_or_404(id)

        # Check if the user is the host.
        if user.user_id not in [host.user_id for host in event.hosts]:
            return jsonify("You're not the host of the event"), 403

        # Update the event
        if 'name' in data:
            event.name = data['name']
        if 'description' in data:
            event.description = data['description']
        if 'status' in data:
            event.status = data['status']
        if 'date_start' in data:
            try:
                date_start = datetime.strptime(data['date_start'], '%Y-%m-%dT%H:%M:%S.%fZ')
                date_start_str = date_start.strftime('%Y-%m-%d %H:%M:%S')
                event.date_start = date_start_str
            except ValueError:
                return jsonify("Invalid date format for Start Date"), 400
        if 'date_end' in data:
            try:
                date_end = datetime.strptime(data['date_end'], '%Y-%m-%dT%H:%M:%S.%fZ')
                date_end_str = date_end.strftime('%Y-%m-%d %H:%M:%S')
                event.date_end = date_end_str
            except ValueError:
                return jsonify("Invalid date format for End Date"), 400
        db.session.commit()

        return jsonify(event.to_dict()), 201
    except NotFound:
        return jsonify('Event not found'), 404
    except Exception as e:
        return jsonify(str(e)), 500

@app.route('/events', methods=['GET'])
def get_events():
    try:
        auth_token = request.headers.get('Authorization')
        refresh_token = request.headers.get('Refreshtoken')

        # Verify the user
        user = verify_user(auth_token, refresh_token, app.config['FIREBASE_WEB_API_KEY'])

        if not user:
            return jsonify("Authentication failed"), 401

        events = Event.query.all()

        return jsonify([event.to_dict() for event in events]), 200
    except Exception as e:
        return jsonify(str(e)), 500
    
@app.route('/events/hosted', methods=['GET'])
def get_hosted_events():
    try:
        auth_token = request.headers.get('Authorization')
        refresh_token = request.headers.get('Refreshtoken')

        # Verify the user
        user = verify_user(auth_token, refresh_token, app.config['FIREBASE_WEB_API_KEY'])

        if not user:
            return jsonify('Authentication failed'), 401

        events = Event.query.filter(Event.hosted_users.any(user_id=user.user_id)).all()

        return jsonify([event.to_dict() for event in events]), 200
    except Exception as e:
        return jsonify(str(e)), 500

@app.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    try: 
        auth_token = request.headers.get('Authorization')
        refresh_token = request.headers.get('Refreshtoken')

        # Verify the user
        user = verify_user(auth_token, refresh_token, app.config['FIREBASE_WEB_API_KEY'])

        if not user:
            return jsonify('Authentication failed'), 401

        event = Event.query.get_or_404(id)

        return jsonify(event.to_dict()), 200
    except NotFound:
        return jsonify("Event not found"), 404
    except Exception as e:
        return jsonify(str(e)), 500

@app.route('/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    try:
        auth_token = request.headers.get('Authorization')
        refresh_token = request.headers.get('Refreshtoken')

        # Verify user
        user = verify_user(auth_token, refresh_token, app.config['FIREBASE_WEB_API_KEY'])

        if not user:
            return jsonify('Authentication failed'), 401
        
        event = Event.query.get_or_404(id)
        
        # Check if the user is the host.
        if user.user_id not in [host.user_id for host in event["hosted_users"]]:
            return jsonify('User is not the host of the event'), 403

        db.session.delete(event)
        db.session.commit()

        return jsonify('Event deleted successfully'), 200
    except NotFound:
        return jsonify("Event not found"), 404
    except Exception as e:
        return jsonify(str(e)), 500

# --- BADGES ---

# Create a badge
@app.route('/badges', methods=['POST'])
def create_badge():
    data = request.get_json()
    if "name" not in data:
        return jsonify({'error': 'Name is not specified'}), 400
    badge_id = str(uuid.uuid4())
    new_badge = Badge(badge_id=badge_id, name=data['name'])
    db.session.add(new_badge)
    db.session.commit()
    return jsonify({'message':"Badge created successfully!", "badge_id": badge_id}), 201

# Update a badge name
@app.route('/badges/<id>', methods=['PUT'])
def update_badge(id):
    data = request.get_json()
    if "name" not in data:
        return jsonify({'error': 'Name is not specified'}), 400
    badge = Badge.query.filter_by(badge_id=id).first()
    if badge is None:
        return jsonify({'error': 'Badge not found'}), 404
    old_name = badge.name
    badge.name = data['name']
    db.session.commit()
    return jsonify({'message':"Badge updated successfully!", "badge_id": id, "old_name": old_name, "new_name": badge.name}), 201

# See badges
@app.route('/badges', methods=['GET'])
def see_badges():
    badges = Badge.query.all()
    return jsonify([{"badge_id": badge.badge_id, "new_name": badge.name} for badge in badges])


# See badges
@app.route('/badges/<id>', methods=['GET'])
def see_badge(id):
    badge = Badge.query.get_or_404(id)
    return jsonify({"badge_id": badge.badge_id, "new_name": badge.name})

# Delete a badge
@app.route('/badges/<id>', methods=['DELETE'])
def delete_badge(id):
    badge = Badge.query.get_or_404(id)
    db.session.delete(badge)
    db.session.commit()
    return jsonify({'message':"Badge deleted successfully!" }), 200

# --- Achievements ---

# Create an achievement
@app.route('/achievements', methods=['POST'])
def create_achievement():
    data = request.get_json()
    achievement_id = str(uuid.uuid4())
    new_achievement = Achievement(achievement_id=achievement_id, name=data['name'], user_id=data["user_id"], badge_id=data["badge_id"], no_to_completion=data["no_to_completion"], progress=data["progress"], completed=data["completed"])
    db.session.add(new_achievement)
    db.session.commit()
    return jsonify({'message':"Achievement created successfully!", "achievement_id": achievement_id}), 201

# Update a badge name
@app.route('/achievements/<id>', methods=['PUT'])
def update_achievement(id):
    data = request.get_json()
    achievement = Achievement.query.filter_by(achievement_id=id).first()
    if achievement is None:
        return jsonify({'error': 'Achievement not found'}), 404
    if "name" in data:
        achievement.name = data["name"]
    if "no_to_completion" in data:
        achievement.no_to_completion = data["no_to_completion"]
    if "progress" in data:
        achievement.progress = data["progress"]
    if "completed" in data:
        achievement.completed = data["completed"]
    db.session.commit()
    return jsonify({'message':"Achievement updated successfully!"}), 200

# See achievements
@app.route('/achievements', methods=['GET'])
def see_achievements():
    achievements = Achievement.query.all()
    return jsonify([{"achievement_id": achievement.achievement_id, "name": achievement.name, "user_id": achievement.user_id, "badge_id": achievement.badge_id, "no_to_completion": achievement.no_to_completion, "progress": achievement.progress, "completed": achievement.completed} for achievement in achievements])

# See achievement
@app.route('/achievements/<id>', methods=['GET'])
def see_achievement(id):
    achievement = Achievement.query.get_or_404(id)
    return jsonify({"achievement_id": achievement.achievement_id, "name": achievement.name, "user_id": achievement.user_id, "badge_id": achievement.badge_id, "no_to_completion": achievement.no_to_completion, "progress": achievement.progress, "completed": achievement.completed})

# Delete a badge
@app.route('/achievements/<id>', methods=['DELETE'])
def delete_achievement(id):
    achievement = Achievement.query.get_or_404(id)
    db.session.delete(achievement)
    db.session.commit()
    return jsonify({'message':"Achievement deleted successfully!" }), 200


# --- METHODS ---

@app.route('/assign_badge', methods=['POST'])
def assign_badge():
    data = request.get_json()

    user_id = data.get('user_id')
    badge_id = data.get('badge_id')
    event_id = data.get('event_id')

    if (not user_id and not event_id) or not badge_id:
        return jsonify({'error': 'user_id / event_id and badge_id are required'}), 400

    badge = Badge.query.filter_by(badge_id=badge_id).first()

    if event_id:
        event = Event.query.filter_by(event_id=event_id).first()
    else:
        user = User.query.filter_by(user_id=user_id).first()        
    
    if (not user_id and not event_id) or not badge:
        return jsonify({'error': 'User / Event or Badge not found'}), 404

    if event_id:
        event.badges.append(badge)
    else:
        user.badges.append(badge)
    db.session.commit()

    return jsonify({'message': 'Badge assigned to user / event successfully'}), 200

@app.route('/participate', methods=['POST'])
def sign_up_to_event():
    data = request.get_json()

    user_id = data.get('user_id')
    event_id = data.get('event_id')

    if not user_id or not event_id:
        return jsonify({'error': 'user_id and event_id are required'}), 400

    user = User.query.filter_by(user_id=user_id).first()
    event = Event.query.filter_by(event_id=event_id).first()

    if not user or not event:
        return jsonify({'error': 'User or Event not found'}), 404

    event_date_end = datetime.datetime.combine(event.date_end, datetime.datetime.min.time())

    if event_date_end <= datetime.datetime.now():
        user.completed_events.append(event)
    else:
        user.signed_up_to.append(event)
    db.session.commit()

    return jsonify({'message': 'User signed up to event successfully'}), 200



if __name__ == '__main__':
    app.run(debug=True)