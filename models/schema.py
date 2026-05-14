# #==IqwanEngine: SQLite Data Schema (Command Center Version)
import os
import sqlite3
import sys

# PENTING: Cari path root secara automatik supaya database.db sentiasa di lokasi yang betul
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database.db")


def init_db():
    """Membina database SQLite dan table leads."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_name TEXT,
                contact_info TEXT,
                additional_info TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        conn.close()
        print(f"✅ #==IqwanEngine: Database diinisialisasi di {DB_PATH}")
    except Exception as e:
        print(f"❌ #==IqwanEngine: Ralat Init: {e}")


def get_all_leads():
    """Mengambil semua data leads dan memaparkannya di terminal."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM leads ORDER BY timestamp DESC")
        rows = cursor.fetchall()

        if not rows:
            print("\n📭 #==IqwanEngine: Tiada rekod lead setakat ini.")
        else:
            print(f"\n📊 #==IqwanEngine: SENARAI REKRUITER ({len(rows)} leads)")
            print("=" * 60)
            for row in rows:
                print(f"🏢 Syarikat : {row[1]}")
                print(f"📱 Hubungi  : {row[2]}")
                print(f"📝 Info     : {row[3]}")
                print(f"⏰ Tarikh   : {row[4]}")
                print("-" * 60)
        conn.close()
    except Exception as e:
        print(f"❌ #==IqwanEngine: Ralat Membaca Data: {e}")


# #==IqwanEngine: Wajib!
def save_lead_to_db(company_name, contact_info, additional_info):
    """Simpan data lead ke dalam database."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO leads (company_name, contact_info, additional_info)
            VALUES (?, ?, ?)
        """,
            (company_name, contact_info, additional_info),
        )
        conn.commit()
        conn.close()
        print(f"✅ #==IqwanEngine: Lead dari {company_name} disimpan dengan betul.")
        return True
    except Exception as e:
        return False


if __name__ == "__main__":
    # Logik untuk menjalankan arahan dari terminal
    if len(sys.argv) > 1 and sys.argv[1] == "view":
        get_all_leads()
    else:
        init_db()
