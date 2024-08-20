from server.models import User
from firebase_admin import auth

def verify_user(request):
    # Get the authToken from the request.
    authorisationHeader = request.headers.get('Authorization')
    authToken = authorisationHeader.split(' ')[1]
    decoded_token = auth.verify_id_token(authToken)
    uid = decoded_token['uid']
    user = User.query.get(uid)

    return user if user else None