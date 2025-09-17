
# ❗ Make sure u have python installed. You can find the path to python.exe by running "where python" in cmd.
# ❗ Paste a path to your Python interpreter to PrusaSlicer filament settings in "Post-processing scripts" and a path to this script.
# e.g. "C:\Path\To\python.exe" "C:\Path\To\firebase.py"
# PrusaSlicer will call this script after slicing a model and pass the path to the generated G-code file as the first argument.
# Make sure you have firebase-admin installed: pip install firebase-admin
# No extra setup.

from asyncio import sleep
import os
import sys
import re
import firebase_admin
from firebase_admin import credentials, firestore
import traceback

try:
    # --- FIREBASE SETTINGS ---
    # Replace the "config.json" with your own config file.
    # Remember to have two similar "config.json" files:
    # 1. One in the same directory as this script for this script to read.
    # 2. One in the "public/config" directory of your web project to allow the web app to read it.
    # TODO change this weird issue, no need to have two files lol.
    FIREBASE_API_KEY = os.path.join(os.path.dirname(__file__), "config.json")
    print(os.path.dirname(__file__))

    # --- SCRIPT LOGIC ---
    def read_filament_data_from_gcode(gcode_filepath):
        filament_g = None
        filament_name = None
        estimated_time = None

        try:
            with open(gcode_filepath, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.startswith('; total filament used [g]'):
                        match = re.search(r'=\s*([\d.]+)', line)
                        if match:
                            filament_g = float(match.group(1))

                    elif line.startswith('; filament_settings_id = '):
                        match = re.search(r'=\s*(.+)', line)
                        if match:
                            filament_name = match.group(1).strip().strip('"')

                    elif line.startswith('; estimated printing time (normal mode)'):
                        match = re.search(r'=\s*(.+)', line)
                        if match:
                            estimated_time = match.group(1).strip()

                    if filament_g and filament_name and estimated_time:
                        break
        except Exception as e:
            print("Błąd", f"Wystąpił błąd podczas odczytu pliku: {e}")
            return None, None, None

        return filament_g, filament_name, estimated_time


    def send_to_firebase(filament_g, filament_name, estimated_time):
        print("=== Inicialization Firebase ===")
        cred = credentials.Certificate(FIREBASE_API_KEY)
        firebase_admin.initialize_app(cred)
        print("=== Firebase Inicializated ===")

        # Get a reference to the Firestore database
        db = firestore.client()

        # 🔍 Szukamy dokumentu po nazwie zamiast ID
        query = db.collection('filaments').where("name", "==", filament_name).limit(1).stream()
        doc = None
        for d in query:
            doc = d
            break

        filament_id = doc.id
        filament_data = doc.to_dict()

        # Set specific data to a document with a known ID
        logs_ref = db.collection('logs')
        # calculate new quantity using data from gcode
        new_quantity = round(filament_data['quantity'] - filament_g, 2)
        log_data = {
            'filamentID': filament_id,
            'quantity': round(filament_g, 2) * (-1),
            'time': firestore.SERVER_TIMESTAMP,
            'status': 'sliced',
            'estimated_time': estimated_time,
            'progress': 0
        }
        # update document in Firestore
        db.collection('filaments').document(filament_id).update({'quantity': new_quantity})
        print(f"Updated quantity.")
        logs_ref.add(log_data)
        print(f"Added log.")

    if __name__ == "__main__":
        # For testing, you can run the script manually and provide a path to a G-code file.

        if len(sys.argv) > 1:
            gcode_file = sys.argv[1]
            print(f"PrusaSlicer przekazał plik: {gcode_file}")
        else:
            # If no argument is provided, use a test path.
            # Or you can drag and drop a G-code file onto this script in Windows Explorer.
            gcode_file = "test.gcode"
            print(f"Uruchomiono skrypt ręcznie. Używam ścieżki testowej: {gcode_file}")

        g, n, t = read_filament_data_from_gcode(gcode_file)

        if g is not None and n is not None and t is not None:
            send_to_firebase(g, n, t)
            print("Zakończono.")
        else:
            print("Nie udało się uzyskać danych o zużyciu filamentu, nie wysyłam do Firebase.")
except Exception as e:
    print("=== WYSTĄPIŁ BŁĄD ===")
    print(e)
    traceback.print_exc()
    sys.exit(1)