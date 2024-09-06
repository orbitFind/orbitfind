import firebase_admin
from firebase_admin import credentials, auth
import os

from flask import json

# Initialize the Firebase Admin SDK
def initialize_firebase():
    cred_json = os.getenv("FIREBASE_ADMIN_SDK_CREDENTIALS")
    if cred_json:
        cred_dict = json.loads(cred_json)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    