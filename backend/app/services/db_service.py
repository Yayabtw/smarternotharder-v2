import os
from supabase import create_client, Client

# TODO: Move these to environment variables for production
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://elemiywbemevklssilhz.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZW1peXdiZW1ldmtsc3NpbGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDk0NjIsImV4cCI6MjA3OTcyNTQ2Mn0.OYNcFKygWDgQ0ywg_lm7bCaLwNv_Nq5Yuppn0koMv_s")

_supabase_client = None

def get_supabase() -> Client:
    global _supabase_client
    if _supabase_client:
        return _supabase_client
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise Exception("Supabase URL and Key are required.")
        
    _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase_client

# Example function to save gamification data
def save_xp(user_id: str, xp: int, level: int):
    # This will fail if table doesn't exist yet
    supabase = get_supabase()
    data = {"user_id": user_id, "xp": xp, "level": level}
    # Upsert logic
    response = supabase.table("profiles").upsert(data).execute()
    return response

