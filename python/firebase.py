# Paste a path to your Python interpreter to PrusaSlicer filament settings in "Post-processing scripts" and a path to this script.
# PrusaSlicer will call this script after slicing a model and pass the path to the generated G-code file as the first argument.
# e.g. "C:\Path\To\python.exe" "C:\Path\To\firebase.py"
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
    # TODO: change this weird issue, no need to have two files lol.
    FIREBASE_API_KEY = os.path.join(os.path.dirname(__file__), "config.json")
    print(os.path.dirname(__file__))

    # --- SCRIPT LOGIC ---
    def read_filament_data_from_gcode(gcode_filepath):
        """
        Reads a g-code file and extracts filament usage in grams and millimeters.
        """
        filament_g = None
        filament_type = None

        try:
            with open(gcode_filepath, 'r', encoding='utf-8') as f:
                for line in f:
                    # Look for the line with filament usage
                    if line.startswith('; total filament used [g]'):
                        match = re.search(r'=\s*([\d.]+)', line)
                        if match:
                            filament_g = float(match.group(1))
                    # Look for the line with profile settings ID
                    elif line.startswith('; filament_settings_id = '):
                        match = re.search(r'=\s*(.+)', line)
                        if match:
                            filament_type = match.group(1).strip().strip('"')
                    # If both values are found, no need to continue reading the file
                    if filament_g is not None and filament_type is not None:
                        break
        except Exception as e:
            print("Błąd", f"Wystąpił błąd podczas odczytu pliku: {e}")
            return None, None

        return filament_g, filament_type

    def send_to_firebase(filament_g, filament_type):
        print("=== Inicialization Firebase ===")
        cred = credentials.Certificate(FIREBASE_API_KEY)
        firebase_admin.initialize_app(cred)
        print("=== Firebase Inicializated ===")

        # Get a reference to the Firestore database
        db = firestore.client()

        # Set specific data to a document with a known ID
        doc_ref = db.collection('filaments').document(filament_type)
        # calculate new quantity using data from gcode
        new_quantity = round(doc_ref.get().to_dict()['quantity'] - filament_g, 2)
        # update document in Firestore
        doc_ref.update({'quantity': new_quantity})
        print(f"Updated quantity.")

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

        g, t = read_filament_data_from_gcode(gcode_file)

        if g is not None and t is not None:
            send_to_firebase(g, t)
            print("Zakończono.")
        else:
            print("Nie udało się uzyskać danych o zużyciu filamentu, nie wysyłam do Firebase.")
except Exception as e:
    print("=== WYSTĄPIŁ BŁĄD ===")
    print(e)
    traceback.print_exc()
    sys.exit(1)