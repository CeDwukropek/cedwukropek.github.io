from asyncio import sleep
import os
import sys
import re
import firebase_admin
from firebase_admin import credentials, firestore
import traceback

try:
    # --- USTAWIENIA FIREBASE ---
    # Zastąp 'config.json' swoim plikiem konfiguracyjnym dla bazy danych.
    FIREBASE_API_KEY = os.path.join(os.path.dirname(__file__), "config.json")
    print(os.path.dirname(__file__))

    # --- LOGIKA SKRYPTU ---
    def read_filament_data_from_gcode(gcode_filepath):
        """
        Reads a g-code file and extracts filament usage in grams and millimeters.
        """
        filament_g = None
        filament_type = None

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
                            filament_type = match.group(1).strip().strip('"')
                    # Przerwij szukanie, jeśli znaleziono obie wartości
                    if filament_g is not None and filament_type is not None:
                        break
        except Exception as e:
            print("Błąd", f"Wystąpił błąd podczas odczytu pliku: {e}")
            return None, None

        return filament_g, filament_type

    def send_to_firebase(filament_g, filament_type):
        # --- Assuming you've already initialized your app like this: ---
        print("=== Inicjalizacja Firebase ===")
        cred = credentials.Certificate(FIREBASE_API_KEY)
        firebase_admin.initialize_app(cred)
        print("=== Firebase zainicjalizowane ===")
        # ----------------------------------------------------------------
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
        # Ten skrypt będzie uruchamiany przez PrusaSlicer po zakończeniu cięcia.
        # PrusaSlicer przekazuje ścieżkę do pliku G-code jako pierwszy argument.
        # Dla testów możesz podać ścieżkę na sztywno lub uruchomić skrypt z argumentem z linii poleceń.

        if len(sys.argv) > 1:
            gcode_file = sys.argv[1]
            print(f"PrusaSlicer przekazał plik: {gcode_file}")
        else:
            # Jeśli uruchamiasz skrypt ręcznie, możesz podać ścieżkę na sztywno do testów
            # lub utworzyć pusty plik 'test.gcode' w tym samym katalogu co skrypt.
            gcode_file = "test.gcode"
            print(f"Uruchomiono skrypt ręcznie. Używam ścieżki testowej: {gcode_file}")
            # Możesz utworzyć pusty plik test.gcode, jeśli chcesz przetestować blok obsługi błędów.
            # Pusty plik lub plik bez danych o filamentcie spowoduje komunikat o błędzie.

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