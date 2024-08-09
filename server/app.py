from datetime import date
from flask import Flask, request, jsonify
from config import Config
from models import db, User, Event
import firebase_admin
from firebase_admin import auth
from firebase_setup import initialize_firebase
from flask_migrate import Migrate

app = Flask(__name__)
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
# go to folder Flask and type >python app.py
# Download app postman
# In postman run: http://127.0.0.1:5000/... (replace ... with the correct url: /users, /events)
# To see all users or events run url with /events or /users and POST method
# To see one record type correct url with /<id> and GET method
# To create a new event, choose POST method with url /events and in body tab paste:
# {
#     "name": "concert",
#     "description": "Taylor Swift concert in Warsaw. Unforgottable event.",
#     "date_start": "2024-08-01",
#     "date_end": "2024-08-03"
# } 
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

        return jsonify({'message': 'Users synced successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Read all users
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'user_id': user.user_id, 'username': user.username, "full_name": user.full_name, 'email': user.email} for user in users])

# Read one user
@app.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify({'user_id': user.user_id, 'username': user.username, "full_name": user.full_name, 'email': user.email})

# Finish user (put the full name, which firebase does not provide - firebase provides email, username and user_id)
@app.route('/users/<string:id>', methods=['PUT'])
def finish_user(id):
    sync_users()
    data = request.get_json()
    user = User.query.get_or_404(id)
    user.full_name = data['full_name']
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

# Delete user
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

# --- EVENTS ---

# Create event
@app.route('/events', methods=['POST'])
def create_event():
    data = request.get_json()
    new_event = Event(name = data['name'], description = data['description'], date_start = data['date_start'], date_end = data['date_end'])
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'message': 'Event created successfully'}), 201

# Update event
@app.route('/events/<int:id>', methods=['PUT'])
def update_event(id):
    data = request.get_json()
    event = Event.query.get_or_404(id)
    if 'name' in data:
        event.name = data['name']
    if 'description' in data:
        event.description = data['description']
    if 'completed' in data:
        event.completed = data['completed']
    if 'date_start' in data:
        try:
            event.date_start = date.fromisoformat(data['date_start'])
        except ValueError:
            return jsonify({"error": "Invalid date format for date_start"}), 400
    if 'date_end' in data:
        try:
            event.date_end = date.fromisoformat(data['date_end'])
        except ValueError:
            return jsonify({"error": "Invalid date format for date_end"}), 400
    db.session.commit()
    return jsonify({'message': 'Event updated successfully'})

@app.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([{'event_id': event.event_id, 'name': event.name, "description": event.description, 'completed': event.completed, 'date_start': event.date_start, 'date_end': event.date_end} for event in events])

@app.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    event = Event.query.get_or_404(id)
    return jsonify({'event_id': event.event_id, 'name': event.name, "description": event.description, 'completed': event.completed, 'date_start': event.date_start, 'date_end': event.date_end})

@app.route('/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    event = Event.query.get_or_404(id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'})



if __name__ == '__main__':
    app.run(debug=True)