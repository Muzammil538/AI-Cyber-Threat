# 🚨 AI Cyber Threat Monitoring Project – Complete Setup Guide

## 1. Project Overview

This project is an end-to-end AI-powered cybersecurity threat monitoring system.  
It includes:
- **Backend API** (FastAPI + Firestore)
- **Frontend Dashboard** (React)
- **ML Model** (for threat prediction)
- **Threat Sender** (Python script to simulate/send threats)

---

## 2. Prerequisites

- Python 3.8+
- Node.js (v16+ recommended) & npm
- Google Cloud account (for Firebase/Firestore)
- (Optional) Git

---

## 3. Set Up Firebase/Firestore

### a. Create a Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Click **Add project** and follow the steps.

### b. Enable Firestore
- In your Firebase project, go to **Build > Firestore Database**
- Click **Create database** and select production or test mode.

### c. Generate Service Account Key
- Go to **Project Settings > Service Accounts**
- Click **Generate new private key** (JSON)
- Download and save as `backend-api/firebase/serviceAccountKey.json`

---

## 4. Backend Setup (FastAPI)

### a. Install Dependencies

```sh
cd backend-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### b. Configure Firebase Credentials

Ensure `serviceAccountKey.json` is in `backend-api/firebase/`  
If you want to use a different path, update this in `main.py`:

```python
cred = credentials.Certificate("firebase/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
```

### c. Run the Backend

```sh
uvicorn main:app --reload
```

- The API will be available at `http://localhost:8000`

---

## 5. Frontend Setup (React Dashboard)

### a. Install Dependencies

```sh
cd ../frontend
npm install
```

### b. Configure API URL

If your backend is not running on `localhost:8000`, update the API URL in your frontend code (usually in a config file or directly in API calls).

### c. (Optional) Configure Firebase for Frontend

If you use Firebase in the frontend (for auth, etc.), update `frontend/src/firebase.js` with your Firebase project config.

### d. Run the Frontend

```sh
npm run dev
```

- The dashboard will be available at `http://localhost:5173`

---

## 6. Threat Sender Script

### a. Configure API URL

In `threats/SendThreat.py`, set `API_URL` to your backend’s `/predict` endpoint:

```python
API_URL = "http://localhost:8000/predict"
```

### b. Run the Script

```sh
cd ../threats
python SendThreat.py
```

---

## 7. ML Model

- Ensure the ML model (`CybersecurityThreatDetector`) is available in `mltraining/predict.py`.
- If a model file is needed, place it in the correct path or provide instructions to train/download it.

---

## 8. Firestore Structure

- The backend will create a `threats` collection in Firestore.
- Each document represents a threat with fields like `type`, `source`, `target`, `status`, etc.

---

## 9. Environment Variables (Optional)

For production, consider using environment variables for secrets and config.  
You can use [python-dotenv](https://pypi.org/project/python-dotenv/) for the backend.

---

## 10. CORS Configuration

In `main.py`, update allowed origins for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change to your frontend domain in production
    ...
)
```

---

## 11. Troubleshooting

- **Permission errors:** Check your Firebase rules and service account permissions.
- **CORS errors:** Make sure backend allows requests from your frontend domain.
- **Model errors:** Ensure the ML model file is present and compatible.

---

## 12. Customizing for Another User

- They must create their own Firebase project and service account.
- Replace `serviceAccountKey.json` in the backend.
- (If used) Update `firebase.js` in the frontend.
- Update API URLs if deploying to different servers.

---

## 13. Project Structure

```
AI-Cyber-Threat/
├── backend-api/
├──--mltraining/
│   | └── predict.py
│   ├── main.py
│   ├── requirements.txt
│   └── firebase/serviceAccountKey.json
├── frontend/
│   ├── src/
│   └── package.json
├── threats/
    └── SendThreat.py

```

---

## 14. Useful Commands

- **Backend:**  
  `uvicorn main:app --reload`
- **Frontend:**  
  `npm run dev`
- **Threat Sender:**  
  `python SendThreat.py`

---

## 15. Contact & Support

If you have issues, check:
- Console logs (backend & frontend)
- Firestore permissions
- API URLs

---

**That’s it! Your AI Cyber Threat Monitoring system should now be ready for use and handoff.**