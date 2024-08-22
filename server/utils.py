from typing import Optional, Tuple
from flask import Request
import requests
from models import User
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