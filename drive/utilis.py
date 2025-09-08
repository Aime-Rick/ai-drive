from dbm import error
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow


creds, _ = google.auth.default()

service = build("drive", "v3", credentials=creds)

def upload_to_drive(file_path, mime_type, folder_id=None):
    pass

def get_drive_contents(name=None, folder_id='root'):
    try:
        query = "trashed = false"
        if name:
            query += f" and name contains '{name}'"
        if folder_id:
            query += f" and '{folder_id}' in parents"

        results = service.files().list(q=query, spaces="drive", fields="nextPageToken, files(id, name, mimeType)").execute()
        return results.get("files", [])

    except HttpError as error:
        print(f"An error occurred: {error}")

def create_drive_folder(folder_name, parent_folder_id=None):
  try:
    if parent_folder_id:
        file_metadata = {
            "name": folder_name,
            "mimeType": "application/vnd.google-apps.folder",
            "parents": [parent_folder_id],
        }
    else:
        file_metadata = {
            "name": folder_name,
            "mimeType": "application/vnd.google-apps.folder",
        }

    # pylint: disable=maybe-no-member
    file = service.files().create(body=file_metadata, fields="id").execute()
    print(f'Folder ID: "{file.get("id")}".')
    return file.get("id")

  except HttpError as error:
    print(f"An error occurred: {error}")
    return None

