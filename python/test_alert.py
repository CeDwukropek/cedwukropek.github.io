import sys
import re
import tkinter as tk
from tkinter import messagebox

def get_filament_usage(gcode_path):
    """
    Reads a g-code file and extracts filament usage in grams and millimeters.
    """
    filament_g = None
    filament_type = None

    try:
        with open(gcode_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('; total filament used [g]'):
                    match = re.search(r'=\s*([\d.]+)', line)
                    if match:
                        filament_g = float(match.group(1))
                elif line.startswith('; default_filament_profile = '):
                    print(line)
                    match = re.search(r'=\s*(.+)', line)
                    if match:
                        filament_type = match.group(1).strip().strip('"')
                # Przerwij szukanie, jeśli znaleziono obie wartości
                if filament_g is not None and filament_type is not None:
                    break
    except Exception as e:
        messagebox.showerror("Błąd", f"Wystąpił błąd podczas odczytu pliku: {e}")
        return None, None

    return filament_g, filament_type

# Główna część skryptu
if __name__ == "__main__":
    if len(sys.argv) > 1:
        gcode_file_path = sys.argv[1]
        
        filament_grams, filament_type = get_filament_usage(gcode_file_path)

        root = tk.Tk()
        root.withdraw()

        if filament_grams is not None:
            message = (f"Użyto filamentu:\n"
                       f"• {filament_grams:.2f} g\n"
                       f"• {filament_type}\n")
            messagebox.showinfo("Zużycie Filamentu", message)
        else:
            messagebox.showwarning("Brak Danych", "Nie udało się znaleźć danych o zużyciu filamentu w pliku G-code.")
    else:
        messagebox.showerror("Błąd", "Brak argumentu z plikiem G-code.")