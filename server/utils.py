from typing import Optional, Tuple
from flask import Request
import requests
from models import Badge, User
from firebase_admin.auth import InvalidIdTokenError, verify_id_token

"""
verify_user(authToken: str) -> User
    Verifies the user's authentication token and returns the user object if the token is valid.
    If the token is invalid, it returns None.
"""
def verify_user(auth_token: str) -> Optional[User]:
    try:
        # Remove "Bearer " from the token if present
        auth_token = auth_token.split(" ")[-1]  
        decoded_token = verify_id_token(auth_token)
        user_id = decoded_token["uid"]
        
        # Query user from your database (e.g., SQLAlchemy ORM)
        user = User.query.get(user_id)
        return user

    except InvalidIdTokenError:
        print("Invalid token provided.")
        return None

    except Exception as e:
        print(f"Token verification failed: {str(e)}")
        return None
    
def handle_event_completes(db, users : list, event) -> list:
    # Convert the list of users to a list of dictionaries
    users = [user.to_dict() for user in users]
    print("Users Dict: ", users)

    # Check if the user has any badges
    for user in users:
        user.completed_events.append(event)
            
    
    db.session.commit()
    return users
    
# def handle_user_badges(db, users: list, type : str = "regular") -> list:
#     # Convert the list of users to a list of dictionaries
#     users = [user.to_dict() for user in users]
#     print("Users Dict: ", users)

#     # Check if the user has any badges
#     for user in users:
#         # Add the "First Event" badge if the user has completed their first event
#         if type == "regular":
#             user = count_and_handle_user_badges(user)
#         elif type == "host":
#             user = count_and_handle_host_badges(user)
    
#     db.session.commit()
#     return users

# def count_and_handle_user_badges(user: User) -> User:
#     if user.completed_events is None:
#         return None

#     if len(user.completed_events) >= 10:
#         user_badge = Badge(name="Experienced")
#         user.badges.append(user_badge)
#     elif len(user.completed_events) >= 3:
#         user_badge = Badge(name="Newbie")
#         user.badges.append(user_badge)
#     elif len(user.completed_events) == 1:
#         first_event_badge = Badge(name="First Event")
#         user.badges.append(first_event_badge)

#     return user

# def count_and_handle_host_badges(host: User) -> User:
#     if host.hosted_events is None:
#         return None

#     if len(host.hosted_events) >= 10:
#         host_badge = Badge(name="Experienced Host")
#         host.badges.append(host_badge)
#     elif len(host.hosted_events) >= 3:
#         host_badge = Badge(name="Newbie Host")
#         host.badges.append(host_badge)
#     elif len(host.hosted_events) == 1:
#         first_host_badge = Badge(name="First Hosted Event")
#         host.badges.append(first_host_badge)

#     return host