import firebase_admin
from firebase_admin import credentials, auth

# Initialize the Firebase Admin SDK
def initialize_firebase():
    cred = credentials.Certificate('firebase/testing-cd1b3-firebase-adminsdk-t2ndu-ce37716fd9.json')
    firebase_admin.initialize_app(cred)