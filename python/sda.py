import json
import firebase_admin
from firebase_admin import credentials, firestore

api_key = None

config_file_path = "python/config.json"

# --- Assuming you've already initialized your app like this: ---
cred = credentials.Certificate(config_file_path)
firebase_admin.initialize_app(cred)
# ----------------------------------------------------------------

# Get a reference to the Firestore database
db = firestore.client()

# 1. Add a new document to a collection (Firestore will generate an ID)
'''doc_ref = db.collection('users').document() # Or db.collection('users') if you want an auto-generated ID
data = {
    'id': '1',
    'age': 30,
    'city': 'New York'
}
doc_ref.set(data) # Or db.collection('users').add(data) for auto-ID
print(f"Added document with ID: {doc_ref.id}")'''

# 2. Set specific data to a document with a known ID
doc_ref = db.collection('Filaments').document('1')

new_quantity = doc_ref.get().to_dict()['quantity'] + 100
doc_ref.update({'quantity': new_quantity})
print(f"Updated quantity.")
