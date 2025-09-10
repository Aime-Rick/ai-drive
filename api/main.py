from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse, HTMLResponse
# from fastapi.middleware.sessions import SessionMiddleware
import google_auth_oauthlib.flow
import os
from api.schemas import StandardResponse, UserRequest
from api.utils import create_user, sign_in_user, sign_out_user, delete_user, save_user_credentials


# FastAPI app
app = FastAPI()

CLIENT_SECRETS_FILE = "client_secret.json"

SCOPES = ["https://www.googleapis.com/auth/drive.file",
          "https://www.googleapis.com/auth/drive.install",
          "https://www.googleapis.com/auth/drive.appdata",
          "https://www.googleapis.com/auth/drive.metadata",
          "https://www.googleapis.com/auth/drive"]  # Scope for Google Ads

REDIRECT_URI = "http://localhost:8000/oauth2callback"


@app.post("/users/signup", response_model=StandardResponse, tags=["Users"])
async def create_new_user(request: UserRequest):
    """Creates a new user."""
    try:
        response = create_user(request.email, request.password)
        return {"status": "success", "data": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"User creation failed: {e}")


@app.post("/users/signin", response_model=StandardResponse, tags=["Users"])
async def sign_in_existing_user(request: UserRequest):
    """Signs in a user."""
    try:
        response = sign_in_user(request.email, request.password)
        return {"status": "success", "data": response}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Sign in failed: {e}")


@app.post("/users/signout", response_model=StandardResponse, tags=["Users"])
async def sign_out_current_user():
    """Signs out the current user."""
    try:
        response = sign_out_user()
        return {"status": "success", "data": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sign out failed: {e}")
    
@app.delete("/users/{user_id}", response_model=StandardResponse, tags=["Users"])
async def delete_user_api(user_id: str):
    """Deletes a user by their ID."""
    try:
        response = delete_user(user_id)
        return {"status": "success", "data": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User deletion failed: {e}")


# app.get("/entry")
# def index():
#     return HTMLResponse(
#         '<h1>Google Ads OAuth2</h1>'
#         '<a href="/authorize">Authorize with Google</a>'
#     )

@app.get("/authorize")
def authorize(request: Request):
    """Step 1: Redirect user to Google's OAuth2 consent screen."""
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES
    )
    flow.redirect_uri = REDIRECT_URI

    authorization_url, state = flow.authorization_url(
        access_type="offline",           # ensures we get a refresh token
        include_granted_scopes="true",   # incremental auth
        prompt="consent"                 # force user consent screen
    )

    # Store state in session
    request.session["state"] = state

    return RedirectResponse(authorization_url)

@app.get("/oauth2callback")
def oauth2callback(request: Request):
    """Step 2: Handle Google's redirect and exchange code for tokens."""
    state = request.session.get("state")

    # Recreate flow object with state
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        state=state
    )
    flow.redirect_uri = REDIRECT_URI

    # Full redirect URL (includes ?code=...)
    authorization_response = str(request.url)

    # Exchange auth code for tokens
    flow.fetch_token(authorization_response=authorization_response)
    credentials = flow.credentials

    # Save tokens in session (in real app: save securely in DB)
    creds = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": list(credentials.scopes)
    }
    save_user_credentials(creds)


    return HTMLResponse(f"""
        <h2>Authorization complete ✅</h2>
        <p><b>Access Token:</b> {credentials.token}</p>
        <p><b>Refresh Token:</b> {credentials.refresh_token}</p>
        <p>You can now use these credentials to call the Google Ads API.</p>
    """)
