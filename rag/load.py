import os
from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import Client, create_client

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def load_documents():
    pass

def load_images():
    pass

def load_audios():
    pass

def load_videos():
    pass