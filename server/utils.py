from models import User
from firebase_admin import auth

def verify_user(authorisationHeader):
    authToken = authorisationHeader.split(' ')[1]
    decoded_token = auth.verify_id_token(authToken)
    uid = decoded_token['uid']
    user = User.query.get(uid)

    return user if user else None

def verify_and_refresh_token(authorisationHeader):
    try:
        
        authToken = authorisationHeader.split(' ')[1]
    except auth.ExpiredIdTokenError:
        refresh_token = request.headers.get('RefreshToken')
        new_id_token = auth.refresh_id_token(refresh_token)
        decoded_token = auth.verify_id_token(new_id_token)
        return new_id_token, decoded_token["exp"]
    except Exception as e:
        return None, None