from typing import Optional, Tuple
from flask import Request
import requests
from models import Badge, User
from firebase_admin.auth import ExpiredIdTokenError, verify_id_token

"""
verify_user(authToken: str, refreshToken: str) -> User
    Verifies the user's authentication token and returns the user object if the token is valid.
    If the token is invalid, it returns None.
"""
def verify_user(auth_token: str, refresh_token: str, FIREBASE_API_KEY: str) -> Optional[User]:
    try:
        auth_token = auth_token.split(" ")[-1]  # Remove "Bearer " from the token
        decoded_token = verify_id_token(auth_token)
        user_id = decoded_token["uid"]
        user = User.query.get(user_id)
        return user
    except ExpiredIdTokenError:
        print("Token expired, attempting to refresh...")
        try:
            new_id_token = refresh_id_token(refresh_token, FIREBASE_API_KEY)
            if new_id_token:
                decoded_token = verify_id_token(new_id_token['id_token'])
                user_id = decoded_token["uid"]
                user = User.query.get(user_id)
                return user
            else:
                print("Failed to refresh token: Token refresh returned None")
                return None  # Return None if token refresh fails
        except Exception as refresh_error:
            print(f"Failed to refresh token: {str(refresh_error)}")
            return None  # Return None if an error occurs during refresh
    except Exception as e:
        print(f"Token verification failed: {str(e)}")
        return None  # Return None if verification fails

"""
refresh_id_token(refreshToken: str, FIREBASE_API_KEY: str) -> Optional[dict]
    Verifies the user's authentication token and refreshes the token if it has expired.
    Returns the new token and its expiration time.
"""
def refresh_id_token(refresh_token: str, FIREBASE_API_KEY: str) -> Optional[dict]:
    try:
        refresh_url = f'https://securetoken.googleapis.com/v1/token?key={FIREBASE_API_KEY}'
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        response = requests.post(refresh_url, data=payload)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to refresh token: {response.json().get('error', {}).get('message', '')}")
            return None  # Return None if the token refresh fails
    except requests.RequestException as e:
        print(f"Network error while refreshing token: {str(e)}")
        return None  # Return None if a network error occurs
    
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