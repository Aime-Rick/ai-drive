from pydantic import BaseModel
from typing import List, Dict, Any, Literal

# --- Standardized Response Model ---

class StandardResponse(BaseModel):
    status: Literal["success", "error"]
    data: Dict[str, Any] | List[Any] | None = None
    message: str | None = None


# --- Request Models for Endpoints ---

class SurveyRequest(BaseModel):
    form_title: str
    context: str
    problematique: str
    objectives: List[str]

class EmailGenerateRequest(BaseModel):
    contexte: str
    objectifs: List[str]
    problematique: str

class EmailSendRequest(BaseModel):
    to_emails: List[str]
    subject: str
    text_content: str

class ResearchRequest(BaseModel):
    context: str
    problematique: str
    objectives: List[str]
    mission_name: str

class FinalReportRequest(BaseModel):
    mission_name: str
    context: str
    problematique: str
    objective: str

class ReportToPdfRequest(BaseModel):
    markdown_content: str
    report_type: str
    file_name: str
    mission_name: str


class CreateMissionRequest(BaseModel):
    data: dict

class UpdateMissionRequest(BaseModel):
    mission_id: str
    updated_data: dict

class UserRequest(BaseModel):
    email: str
    password: str

class DownloadReportRequest(BaseModel):
    local_file_path: str
    remote_file_path: str

