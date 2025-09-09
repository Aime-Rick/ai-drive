import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
import dotenv
import os

dotenv.load_dotenv()

mime_types = os.getenv("MIME_TYPES")

creds, _ = google.auth.default()

service = build("drive", "v3", credentials=creds)

def upload_to_drive(file_path, file_name, folder_id='root'):
    try:

        file_metadata = {"name": file_name, "parents": [folder_id]}
        file_extension = file_name.split(".")[-1]

        media = MediaFileUpload(
            file_path, mimetype=mime_types[file_extension], resumable=True
        )
        # pylint: disable=maybe-no-member
        file = (
            service.files()
            .create(body=file_metadata, media_body=media, fields="id")
            .execute()
        )
        print(f'File ID: "{file.get("id")}".')
        return file.get("id")

    except HttpError as error:
        print(f"An error occurred: {error}")
        return None

def get_drive_contents(name=None, folder_id='root'):
    try:
        query = "trashed = false"
        if name:
            query += f" and name contains '{name}'"
        if folder_id:
            query += f" and '{folder_id}' in parents"

        results = service.files().list(q=query, spaces="drive", fields="files(id, name, mimeType)").execute()
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

