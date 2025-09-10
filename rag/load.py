import os
from supabase.client import Client, create_client
from langchain_google_community import GoogleDriveLoader
from langchain_text_splitters import CharacterTextSplitter
from dotenv import load_dotenv
from utils import download_file
import base64
load_dotenv()
import mimetypes
import speech_recognition as sr
import io
from pydub import AudioSegment
import noisereduce as nr
import librosa
import soundfile as sf

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def chunk_text(text, chunk_size=1000, overlap=200):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        # move the start forward but keep some overlap
        start += chunk_size - overlap

    return chunks

def load_documents():
    loader = GoogleDriveLoader(
        credentials_path="/home/ricko/ai-drive/rag/credentials/credentials.json",
        token_path="/home/ricko/ai-drive/rag/credentials/token.json",
        folder_id="root",
        file_types=["document", "pdf"],
        recursive=True,
        scopes=["https://www.googleapis.com/auth/drive.file"]
    )
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)
    for doc in docs:
        response = (
            supabase.table("documents")
            .insert({"content": doc.page_content})
            .execute()
        )
    print(f"Loaded {len(docs)} documents from Google Drive")

def load_document():
    pass
    

def load_image(file_id):
    file = download_file(file_id)
    base64_str = base64.b64encode(file).decode("utf-8")
    mime_type = mimetypes.guess_type("myimage.png")[0] or "application/octet-stream"

    data_uri = f"data:{mime_type};base64,{base64_str}"
    response = (
            supabase.table("documents")
            .insert({"content": data_uri})
            .execute()
        )
    print("Image loaded to database")

def audio_bytes_to_wav_bytes(audio_bytes: bytes) -> bytes:
    """
    Convert any audio format (mp3, wav, ogg, m4a, etc.) to 16kHz PCM WAV bytes.
    Requires ffmpeg or avlib installed.
    """
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_frame_rate(16000).set_channels(1)  # standard for ASR

    out_buffer = io.BytesIO()
    audio.export(out_buffer, format="wav")
    return out_buffer.getvalue()

def denoise_wav_bytes(wav_bytes: bytes) -> bytes:
    """Apply noise reduction to WAV bytes."""
    y, sr = librosa.load(io.BytesIO(wav_bytes), sr=None, mono=True)
    y_clean = nr.reduce_noise(y=y, sr=sr)
    out_buffer = io.BytesIO()
    sf.write(out_buffer, y_clean, sr, format="WAV", subtype="PCM_16")
    return out_buffer.getvalue()

def load_audio(file_id, denoise=True):
    file = download_file(file_id)                 # raw audio bytes (any format)
    file = audio_bytes_to_wav_bytes(file)         # convert to wav
    if denoise:
        file = denoise_wav_bytes(file)            # optional noise reduction
    
    recognizer = sr.Recognizer()
    audio_file = io.BytesIO(file)

    with sr.AudioFile(audio_file) as source:
        audio_data = recognizer.record(source)

        try:
            text = recognizer.recognize_google(audio_data)
            print("Transcription: ", text)
        except sr.UnknownValueError:
            print("Speech recognition could not understand the audio.")
            return None
        except sr.RequestError as e:
            print(f"Could not request results from service; {e}")
            return None
    
    # Chunk & save to DB
    chunks = chunk_text(text)
    for chunk in chunks:
        supabase.table("documents").insert({"content": chunk}).execute()
    
    print(f"Loaded {len(chunks)} text chunks from audio file to database")


def load_videos():
    pass
# response = (
#     supabase.table("planets")
#     .insert({"id": 1, "name": "Pluto"})
#     .execute()
# )



# loader = TextLoader("../../how_to/state_of_the_union.txt")
# documents = loader.load()
# text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
# docs = text_splitter.split_documents(documents)

# loader = GoogleDriveLoader(
#     folder_id="1yucgL9WGgWZdM1TOuKkeghlPizuzMYb5",
#     file_types=["document", "sheet"],
#     recursive=False,
# )

load_audio("124AYmqtlXt2P5gs85LbmbAaDwBUXcOAO")
