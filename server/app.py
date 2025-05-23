
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

@app.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    try:
        auth_token = request.headers.get('Authorization')  # Ensure consistency in header names

        # Verify the user
        user = verify_user(auth_token)

        if not user:
            return jsonify({'error': "Authentication failed"}), 401
        
        # Authorization check - Uncomment if necessary
        # if user.user_id != id:
        #     return jsonify({'error': 'User is not authorized to view this user'}), 403
        
        user = User.query.get_or_404(id)
        user_events = Event.query.filter(Event.signed_up_users.any(user_id=user.user_id)).all()
        hosted_events = Event.query.filter(Event.hosted_users.any(user_id=user.user_id)).all()
        completed_events = Event.query.filter(Event.completed_users.any(user_id=user.user_id)).all()

        # ! Badge feature is buggy
        # badges = Badge.query.filter(Badge.users_with_this_badge.any(user_id=user.user_id)).all()  # Fixed backref name

        return jsonify({
            'id': user.user_id,
            'username': user.username,
            "full_name": user.full_name,
            'bio': user.bio,
            'email': user.email,
            # 'badges': [badge.to_dict() for badge in badges], # ! Badge feature is buggy
            'signedUpTo': [{
                'event_id': event.event_id,
                'name': event.name,
                'description': event.description,
                'date_start': event.date_start,
                'date_end': event.date_end,
                'region': event.region,
                'location': event.location,
                'tags': event.tags,
                'status': event.status,
                'signed_up_users': [user.to_dict() for user in event.signed_up_users],
                'hosted_users': [host.to_dict() for host in event.hosted_users],
                'completed_users': [completed.to_dict() for completed in event.completed_users]
            } for event in user_events],
            'hostedEvents': [{
                'event_id': event.event_id,
                'name': event.name,
                'description': event.description,
                'date_start': event.date_start,
                'date_end': event.date_end,
                'region': event.region,
                'location': event.location,
                'tags': event.tags,
                'status': event.status,
            } for event in hosted_events],
            'completedEvents': [{
                'event_id': event.event_id,
                'name': event.name,
                'description': event.description,
                'date_start': event.date_start,
                'date_end': event.date_end,
                'region': event.region,
                'location': event.location,
                'tags': event.tags,
                'status': event.status,
            } for event in completed_events]
        }), 200
    except NotFound:
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"Error in get_user: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/users/<string:id>', methods=['PUT'])
def update_user(id):
    try:
        auth_token = request.headers.get('Authorization')

        # Verify the user
        user = verify_user(auth_token)

        if not user:
            return jsonify({'error': "Authentication failed"}), 401
        
        if user.user_id != id:
            return jsonify({'error': 'User is not authorized to update this user'}), 403

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
        if 'bio' in data:
            user.bio = data['bio']
        # ! Profile picture is not yet implemented
        # if 'profilePic' in data:
        #     user.profile_picture = data['profilePic']
        # Ensure signed_up_events is a list of Event instances
        if 'signedUpTo' in data:
            user.signed_up_events = [db.session.get(Event, event["event_id"]) for event in data['signedUpTo'] if db.session.get(Event,  event["event_id"]) is not None]
        
        # Ensure hosted_events is a list of Event instances
        if 'hostedEvents' in data:
            user.hosted_events = [db.session.get(Event, event["event_id"]) for event in data['hostedEvents'] if db.session.get(Event, event["event_id"]) is not None]
        
        # Ensure completed_events is a list of Event instances
        if 'completedEvents' in data:
            user.completed_events = [db.session.get(Event, event["event_id"]) for event in data['completedEvents'] if db.session.get(Event, event["event_id"]) is not None]


        db.session.commit()
    
        return jsonify({'message': 'User updated successfully'}), 201
    except NotFound:
        # To retrieve this on the frontend, do response.json() and then get the key 'error'.
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        # To retrieve this on the frontend, do response.json() and then get the key 'error'.
        print(e)
        return jsonify({'error': str(e)}), 500

# Delete user
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        auth_token = request.headers.get('Authorization')

        # Verify the user
        user = verify_user(auth_token)

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

        # Verify the user
        user = verify_user(auth_token)

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
            category = data['category'],
            date_start = date_start_str,
            date_end = date_end_str,
            region=data["region"],
            location=data["location"],
            tags=list(data["tags"]),
            status=data["status"],
            hosted_users=[user])
        # if "badges" in data:                     # ! Badge feature is buggy  
        #     new_event.badges = data["badges"]
        db.session.add(new_event)
        db.session.commit()

        # To retrieve this on the frontend, do response.json() and then get the key 'message'.
        return jsonify({'message': 'Event created successfully'}), 201
    except Exception as e:
        # To retrieve this on the frontend, do response.json() and then get the key 'error'.
        print(e)
        return jsonify(str(e)), 500
        

# Update event
@app.route('/events/<int:id>', methods=['PUT'])
def update_event(id):
    try:
        auth_token = request.headers.get('Authorization')

        # Verify the user
        user = verify_user(auth_token)

        if not user:
            return jsonify("Authentication failed"), 401

        data = request.get_json()
        event = Event.query.get_or_404(id)

        # Check if the user is the host.
        if user.user_id not in [host.user_id for host in event.hosted_users]:
            return jsonify("You're not the host of the event"), 403

        # Update the event
        if 'name' in data:
            event.name = data['name']
        if 'description' in data:
            event.description = data['description']
        if 'category' in data:
            event.category = data['category']
        if 'status' in data:
            event.status = data['status']
        if 'date_start' in data:
            try:
                date_start_str : str = data["date_start"]
                date_start_obj = datetime.strptime(date_start_str, "%a, %d %b %Y %H:%M:%S %Z")
                date_start_mysql = date_start_obj.strftime("%Y-%m-%d %H:%M:%S")

                event.date_start = date_start_mysql
            except ValueError:
                return jsonify("Invalid date format for Start Date"), 400
        if 'date_end' in data:
            try:
                date_end_str : str = data["date_end"]
                date_end_obj = datetime.strptime(date_end_str, "%a, %d %b %Y %H:%M:%S %Z")
                date_end_mysql = date_end_obj.strftime("%Y-%m-%d %H:%M:%S")

                event.date_end = date_end_mysql
            except ValueError:
                return jsonify("Invalid date format for End Date"), 400
        if 'region' in data:
            event.region = data['region']
        if 'location' in data:
            event.location = data['location']
        if 'tags' in data:
            event.tags = data['tags']
        if 'hosted_users' in data:
            event.hosted_users = [db.session.get(User, user["user_id"]) for user in data['hosted_users'] if db.session.get(User, user["user_id"]) is not None]
        if 'signed_up_users' in data:
            event.signed_up_users = [db.session.get(User, user["user_id"]) for user in data['signed_up_users'] if db.session.get(User, user["user_id"]) is not None]
        if 'completed_users' in data:
            event.completed_users = [db.session.get(User, user["user_id"]) for user in data['completed_users'] if db.session.get(User, user["user_id"]) is not None]
        
            
        db.session.commit()

        return jsonify({'message': 'Event updated successfully'}), 201
    except NotFound:
        return jsonify('Event not found'), 404
    except Exception as e:
        print(e)
        return jsonify(str(e)), 500

# RSVP to event
@app.route('/events/<int:id>/rsvp', methods=['PUT'])
def rsvp_event(id):
    try:
        auth_token = request.headers.get('Authorization')

        # Verify the user
        user = verify_user(auth_token)

        if not user:
            return jsonify("Authentication failed"), 401

        event = Event.query.get_or_404(id)

        if user.user_id in [host.user_id for host in event.hosted_users]:
            print("User is the host of the event")
            return jsonify('User is the host of the event'), 403
        
        event.signed_up_users.append(user)
        db.session.commit()

        return jsonify({'message': 'RSVP successful'}), 201
    except NotFound:
        return jsonify('Event not found'), 404
    except Exception as e:
        print(e)
        return jsonify(str(e)), 500
    
# End event
@app.route('/events/<int:id>/end', methods=['PUT'])
def end_event(id):
    try:
        auth_token = request.headers.get('Authorization')

        # Verify the user
        user = verify_user(auth_token)

        if user is None:
            return jsonify("Authentication failed"), 401

        event = Event.query.get_or_404(id)

        if event is None:
            raise NotFound(f"Event with ID {id} not found")

        if user.user_id not in [host.user_id for host in event.hosted_users]:
            return jsonify('User is not the host of the event'), 403

        event.status = 'completed'

        # handle_user_badges(db, event.signed_up_users, event)

        # # Handle user badges
        # event.completed_users = handle_user_badges(db, event.completed_users, type="regular")
        # # Handle host badges
        # event.hosted_users = handle_user_badges(db, event.hosted_users, type="host")

        db.session.commit()

        print("event: ", event.to_dict())

        return jsonify({'message': 'Event ended successfully'}), 201
    except NotFound:
        return jsonify('Event not found'), 404
    except Exception as e:
        print(e)
        return jsonify(str(e)), 500
    
# Get all events
@app.route('/events', methods=['GET'])
def get_events():
    try:
        auth_token = request.headers.get('Authorization')

        # Verify the user
        user = verify_user(auth_token)

        if not user:
            return jsonify("Authentication failed"), 401

        events = Event.query.all()

        return jsonify(
            [{
                'event_id': event.event_id,
                'name': event.name,
                'description': event.description,
                'category': event.category,
                'date_start': event.date_start,
                'date_end': event.date_end,
                'region': event.region,
                'location': event.location,
                'tags': event.tags,
                'status': event.status,
                'hosted_users': [host.to_dict() for host in event.hosted_users],
                'signed_up_users': [user.to_dict() for user in event.signed_up_users],
            } for event in events]
            ), 200
    except Exception as e:
        return jsonify(str(e)), 500

@app.route('/events/hosted', methods=['GET'])
def get_hosted_events():
    try:
        auth_token = request.headers.get('Authorization')  # Ensure consistency in header names

        # Verify the user
        user = verify_user(auth_token)

        if not user:
            return jsonify({'error': 'Authentication failed'}), 401

        events = Event.query.filter(Event.hosted_users.any(user_id=user.user_id)).all()

        # # Update event statuses
        now = datetime.utcnow()  # Use UTC for consistency
        for event in events:
            if event.status == "before":
                if event.date_start.date() == now.date() and event.status != 'ongoing':
                    event.status = 'ongoing'
                # elif now >= event.date_end and event.status != 'completed':
                #     event.status = 'completed'
        db.session.commit()


        return jsonify([{
            'event_id': event.event_id,
            'name': event.name,
            'description': event.description,
            'category': event.category,
            'date_start': event.date_start,
            'date_end': event.date_end,
            'region': event.region,
            'location': event.location,
            'tags': event.tags,
            'status': event.status,
            'hosted_users': [host.to_dict() for host in event.hosted_users],
            'signed_up_users': [user.to_dict() for user in event.signed_up_users],
            'completed_users': [completed.to_dict() for completed in event.completed_users]
        } for event in events]), 200
    except Exception as e:
        print(f"Error in get_hosted_events: {e}")
        return jsonify({'error': str(e)}), 500

# Get specific event
@app.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    try: 
        auth_token = request.headers.get('Authorization')

        # Verify the user
        user = verify_user(auth_token)

        if not user:
            return jsonify('Authentication failed'), 401

        event = Event.query.get_or_404(id)

        return jsonify(event.to_dict()), 200
    except NotFound:
        return jsonify("Event not found"), 404
    except Exception as e:
        return jsonify(str(e)), 500

# Delete event
@app.route('/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    try:
        print("Deleting event: " + str(id))
        auth_token = request.headers.get('Authorization')

        # Verify user
        user = verify_user(auth_token)

        if not user:
            return jsonify('Authentication failed'), 401
        
        event = Event.query.get_or_404(id)
        print("Event found: " + str(event))
        
        # Check if the user is the host.
        if user.user_id not in [host.user_id for host in event.hosted_users]:
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
    app.run(port=os.getenv('PORT'), debug=True)