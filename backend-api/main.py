from fastapi import FastAPI, HTTPException, Depends, Security, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, List, Optional, Any
import uvicorn
import json
import os
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore, auth
from pydantic import BaseModel, Field
from fastapi import Path


from mltraining.predict import CybersecurityThreatDetector



# Initialize FastAPI
app = FastAPI(
    title="Cybersecurity Threat Detection API",
    description="API for detecting and classifying cybersecurity threats in financial institutions",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with your Netlify domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize Firebase
try:
    # Check if running in production or development
    if os.path.exists("../firebase/serviceAccountKey.json"):
        # Development environment - use service account key file
        cred = credentials.Certificate("../firebase/serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    else:
        # Production environment - use environment variables
        firebase_admin.initialize_app()
    
    db = firestore.client()
    print("Firebase initialized successfully")
except Exception as e:
    print(f"Error initializing Firebase: {str(e)}")
    # Continue without Firebase in case of failure
    db = None

# Initialize the threat detector
try:
    threat_detector = CybersecurityThreatDetector()
    print("Threat detector initialized successfully")
except Exception as e:
    print(f"Error initializing threat detector: {str(e)}")
    threat_detector = None

# Pydantic models for request/response validation
class ThreatData(BaseModel):
    duration: float = Field(..., description="Connection duration in seconds")
    protocol_type: str = Field(..., description="Protocol type (e.g., tcp, udp, icmp)")
    service: str = Field(..., description="Network service (e.g., http, ftp, smtp)")
    flag: str = Field(..., description="Connection status flag")
    src_bytes: int = Field(..., description="Bytes sent from source to destination")
    dst_bytes: int = Field(..., description="Bytes sent from destination to source")
    land: int = Field(..., description="1 if connection is from/to same host/port; 0 otherwise")
    wrong_fragment: int = Field(..., description="Number of wrong fragments")
    urgent: int = Field(..., description="Number of urgent packets")
    hot: int = Field(..., description="Number of 'hot' indicators")
    num_failed_logins: int = Field(..., description="Number of failed login attempts")
    logged_in: int = Field(..., description="1 if successfully logged in; 0 otherwise")
    num_compromised: int = Field(..., description="Number of compromised conditions")
    root_shell: int = Field(..., description="1 if root shell is obtained; 0 otherwise")
    su_attempted: int = Field(..., description="1 if 'su root' command attempted; 0 otherwise")
    num_root: int = Field(..., description="Number of 'root' accesses")
    num_file_creations: int = Field(..., description="Number of file creation operations")
    num_shells: int = Field(..., description="Number of shell prompts")
    num_access_files: int = Field(..., description="Number of operations on access control files")
    num_outbound_cmds: int = Field(..., description="Number of outbound commands in an ftp session")
    is_host_login: int = Field(..., description="1 if the login belongs to the 'hot' list; 0 otherwise")
    is_guest_login: int = Field(..., description="1 if the login is a 'guest' login; 0 otherwise")
    count: int = Field(..., description="Number of connections to the same host in past 2 seconds")
    srv_count: int = Field(..., description="Number of connections to the same service in past 2 seconds")
    serror_rate: float = Field(..., description="% of connections that have 'SYN' errors")
    srv_serror_rate: float = Field(..., description="% of connections to the same service that have 'SYN' errors")
    rerror_rate: float = Field(..., description="% of connections that have 'REJ' errors")
    srv_rerror_rate: float = Field(..., description="% of connections to the same service that have 'REJ' errors")
    same_srv_rate: float = Field(..., description="% of connections to the same service")
    diff_srv_rate: float = Field(..., description="% of connections to different services")
    srv_diff_host_rate: float = Field(..., description="% of connections to different hosts")
    dst_host_count: int = Field(..., description="Number of connections to the same destination host")
    dst_host_srv_count: int = Field(..., description="Number of connections to the same destination host using same service")
    dst_host_same_srv_rate: float = Field(..., description="% of connections to the same destination host using same service")
    dst_host_diff_srv_rate: float = Field(..., description="% of connections to the same destination host using different services")
    dst_host_same_src_port_rate: float = Field(..., description="% of connections from same source port")
    dst_host_srv_diff_host_rate: float = Field(..., description="% of connections to different destination machines")
    dst_host_serror_rate: float = Field(..., description="% of connections to the destination host that have 'SYN' errors")
    dst_host_srv_serror_rate: float = Field(..., description="% of connections to the destination host and specified service that have 'SYN' errors")
    dst_host_rerror_rate: float = Field(..., description="% of connections to the destination host that have 'REJ' errors")
    dst_host_srv_rerror_rate: float = Field(..., description="% of connections to the destination host and specified service that have 'REJ' errors")
    target: Optional[str] = Field(None, description="Target system or asset")
    type: Optional[str] = Field(None, description="Threat type (optional, will use model prediction if not provided)")
    source: Optional[str] = Field(None, description="Source system or IP (optional)")
    details: Optional[str] = None
    status: Optional[str] = None
    protocol_type: Optional[str] = None
    service: Optional[str] = None
    severity: Optional[str] = None

    
    class Config:
        json_schema_extra = {
            "example": {
                "duration": 0,
                "protocol_type": "tcp",
                "service": "http",
                "flag": "SF",
                "src_bytes": 181,
                "dst_bytes": 5450,
                "land": 0,
                "wrong_fragment": 0,
                "urgent": 0,
                "hot": 0,
                "num_failed_logins": 0,
                "logged_in": 1,
                "num_compromised": 0,
                "root_shell": 0,
                "su_attempted": 0,
                "num_root": 0,
                "num_file_creations": 0,
                "num_shells": 0,
                "num_access_files": 0,
                "num_outbound_cmds": 0,
                "is_host_login": 0,
                "is_guest_login": 0,
                "count": 8,
                "srv_count": 8,
                "serror_rate": 0,
                "srv_serror_rate": 0,
                "rerror_rate": 0,
                "srv_rerror_rate": 0,
                "same_srv_rate": 1.0,
                "diff_srv_rate": 0,
                "srv_diff_host_rate": 0,
                "dst_host_count": 9,
                "dst_host_srv_count": 9,
                "dst_host_same_srv_rate": 1.0,
                "dst_host_diff_srv_rate": 0,
                "dst_host_same_src_port_rate": 0.11,
                "dst_host_srv_diff_host_rate": 0,
                "dst_host_serror_rate": 0,
                "dst_host_srv_serror_rate": 0,
                "dst_host_rerror_rate": 0,
                "dst_host_srv_rerror_rate": 0
            }
        }

class AlertFilter(BaseModel):
    threat_level: Optional[str] = Field(None, description="Filter by threat level")
    start_date: Optional[str] = Field(None, description="Start date for alerts (ISO format)")
    end_date: Optional[str] = Field(None, description="End date for alerts (ISO format)")
    limit: Optional[int] = Field(10, description="Maximum number of alerts to return")
    
    class Config:
        json_schema_extra = {
            "example": {
                "threat_level": "high",
                "start_date": "2025-05-01T00:00:00Z",
                "end_date": "2025-05-18T23:59:59Z",
                "limit": 20
            }
        }

class ThreatResponse(BaseModel):
    id: Optional[str] = None
    type: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    source: Optional[str] = None
    target: Optional[str] = None
    details: Optional[str] = None
    prediction: str
    threat_level: str
    class_probabilities: Dict[str, float]
    anomaly_score: float
    is_anomaly: bool
    explanation: Dict[str, Any]
    timestamp: str
    source_data: Optional[Dict] = None

# Firebase authentication middleware
async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        # Verify the Firebase ID token
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

# API endpoints
@app.get("/")
async def root():
    return {"message": "Cybersecurity Threat Detection API"}

@app.get("/health")
async def health_check():
    # Check if models and Firebase are working
    status = {
        "api_status": "healthy", 
        "models_status": "healthy" if threat_detector else "unavailable",
        "firebase_status": "connected" if db else "disconnected"
    }
    
    if threat_detector and db:
        return status
    else:
        return status, 503  # Service unavailable if any component is down

@app.patch("/threats/{threat_id}/status")
async def update_threat_status(
    threat_id: str = Path(...),
    body: dict = Body(...)
):
    if not db:
        raise HTTPException(status_code=503, detail="Database connection not available")
    try:
        status = body.get("status")
        if not status:
            raise HTTPException(status_code=400, detail="Missing status")
        doc_ref = db.collection("threats").document(threat_id)
        doc_ref.update({"status": status})
        return {"message": "Status updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/predict", response_model=ThreatResponse)
async def predict_threat(
    data: ThreatData,
    # user_token: dict = Depends(verify_token)
):
    if not threat_detector:
        raise HTTPException(status_code=503, detail="Threat detection model not available")
    
    # Convert Pydantic model to dict
    input_data = data.dict()
    
    # Get prediction from model
    prediction = threat_detector.predict(input_data)
    
    if "error" in prediction:
        raise HTTPException(status_code=500, detail=prediction["error"])
    
    # Compose result for Firestore and frontend
    result = {
        "type": input_data.get("type", prediction.get("prediction", "Unknown")),
        "severity": input_data.get("severity", prediction.get("threat_level", "Unknown")).capitalize(),
        "source": input_data.get("source", "Unknown"),
        "target": input_data.get("target", "Unknown"),
        "status": input_data.get("status", "Active"),
        "timestamp": prediction["timestamp"],
        "details": input_data.get("details", prediction.get("details", "")),
        "prediction": prediction.get("prediction", ""),
        "threat_level": prediction.get("threat_level", ""),
        "class_probabilities": prediction.get("class_probabilities", {}),
        "anomaly_score": prediction.get("anomaly_score", 0),
        "is_anomaly": prediction.get("is_anomaly", False),
        "explanation": prediction.get("explanation", {}),
        "source_data": input_data,
    }
    
    # Store the result in Firebase if available
    if db:
        try:
            doc_ref = db.collection("threats").document()
            doc_ref.set(result)
            result["id"] = doc_ref.id
        except Exception as e:
            print(f"Error storing prediction in Firebase: {str(e)}")
    
    return result


@app.get("/alerts", response_model=List[ThreatResponse])
async def get_alerts(
    filters: AlertFilter = Depends()
):
    if not db:
        raise HTTPException(status_code=503, detail="Database connection not available")
    
    try:
        # Start with the threats collection
        query = db.collection("threats")
        
        # Apply filters
        if filters.threat_level:
            query = query.where("threat_level", "==", filters.threat_level)
        
        # Apply date range filters if provided
        if filters.start_date:
            start_datetime = datetime.fromisoformat(filters.start_date.replace('Z', '+00:00'))
            query = query.where("timestamp", ">=", start_datetime.isoformat())
        
        if filters.end_date:
            end_datetime = datetime.fromisoformat(filters.end_date.replace('Z', '+00:00'))
            query = query.where("timestamp", "<=", end_datetime.isoformat())
        
        # Order by timestamp descending (most recent first)
        query = query.order_by("timestamp", direction=firestore.Query.DESCENDING)
        
        # Limit the number of results
        query = query.limit(filters.limit or 10)
        
        # Execute the query
        docs = query.stream()
        
        # Convert to list of dictionaries
        alerts = []
        for doc in docs:
            alert_data = doc.to_dict()
            alert_data["id"] = doc.id
            alerts.append(alert_data)
        
        return alerts
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving alerts: {str(e)}")

@app.get("/alerts/{alert_id}", response_model=ThreatResponse)
async def get_alert_by_id(
    alert_id: str
):
    if not db:
        raise HTTPException(status_code=503, detail="Database connection not available")
    
    try:
        # Get the specific alert document
        doc_ref = db.collection("threats").document(alert_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"Alert with ID {alert_id} not found")
        
        # Convert to dictionary and add the ID
        alert_data = doc.to_dict()
        alert_data["id"] = doc.id
        
        return alert_data
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving alert: {str(e)}")

@app.post("/bulk-predict")
async def bulk_predict_threats(
    data_list: List[ThreatData],
    user_token: dict = Depends(verify_token)
):
    if not threat_detector:
        raise HTTPException(status_code=503, detail="Threat detection model not available")
    
    results = []
    
    for data in data_list:
        # Convert Pydantic model to dict
        input_data = data.dict()
        
        # Get prediction from model
        result = threat_detector.predict(input_data)
        
        if "error" in result:
            # Continue with other predictions even if one fails
            result = {"error": result["error"], "source_data": input_data}
        else:
            # Add source data to the result
            result["source_data"] = input_data
            
            # Store the result in Firebase if available
            if db:
                try:
                    # Add user information
                    result["user_id"] = user_token.get("uid")
                    result["user_email"] = user_token.get("email")
                    
                    # Add to Firestore
                    doc_ref = db.collection("threats").document()
                    doc_ref.set(result)
                    
                    # Add document ID to the result
                    result["id"] = doc_ref.id
                except Exception as e:
                    print(f"Error storing prediction in Firebase: {str(e)}")
        
        results.append(result)
    
    return {"results": results, "count": len(results)}

@app.get("/statistics")
async def get_statistics(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    user_token: dict = Depends(verify_token)
):
    if not db:
        raise HTTPException(status_code=503, detail="Database connection not available")
    
    try:
        # Query all threats within the date range
        query = db.collection("threats")
        
        if start_date:
            start_datetime = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.where("timestamp", ">=", start_datetime.isoformat())
        
        if end_date:
            end_datetime = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.where("timestamp", "<=", end_datetime.isoformat())
        
        # Execute the query
        docs = query.stream()
        
        # Count by threat level and prediction type
        stats = {
            "total_threats": 0,
            "threat_levels": {
                "low": 0,
                "medium": 0,
                "high": 0,
                "critical": 0,
                "unknown": 0
            },
            "prediction_types": {},
            "anomalies": 0
        }
        
        for doc in docs:
            data = doc.to_dict()
            
            # Increment total count
            stats["total_threats"] += 1
            
            # Count by threat level
            threat_level = data.get("threat_level", "unknown")
            if threat_level in stats["threat_levels"]:
                stats["threat_levels"][threat_level] += 1
            else:
                stats["threat_levels"][threat_level] = 1
            
            # Count by prediction type
            prediction = data.get("prediction")
            if prediction:
                if prediction in stats["prediction_types"]:
                    stats["prediction_types"][prediction] += 1
                else:
                    stats["prediction_types"][prediction] = 1
            
            # Count anomalies
            if data.get("is_anomaly", False):
                stats["anomalies"] += 1
        
        return stats
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving statistics: {str(e)}")

@app.get("/test-firestore")
async def test_firestore():
    if not db:
        return {"error": "No DB"}
    docs = db.collection("threats").stream()
    return [doc.id for doc in docs]

# Run the server if executed directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)