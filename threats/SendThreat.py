# send_threat.py
import requests
import random

# Replace with your backend URL if not running locally
API_URL = "http://localhost:8000/predict"

# Example threat data (use real or simulated values)


fixed_data = {
    "duration": 0,
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
    "dst_host_srv_rerror_rate": 0,
}

threats = [
    {
        "type": "Ransomware",
        "severity": "Critical",
        "source": "192.168.1.45",
        "target": "File Server",
        "details": "Potential ransomware activity detected. Multiple encryption operations observed.",
        "status": "Active",
        "protocol_type": "tcp",
        "service": "smb",
    },
    {
        "type": "Brute Force",
        "severity": "High",
        "source": "203.45.67.89",
        "target": "Auth Gateway",
        "details": "Multiple failed login attempts from external IP.",
        "status": "Active",
        "protocol_type": "tcp",
        "service": "ssh",
    },
    {
        "type": "Data Exfiltration",
        "severity": "High",
        "source": "172.16.32.12",
        "target": "Database Server",
        "details": "Unusual data transfer patterns detected from internal database.",
        "status": "Active",
        "protocol_type": "tcp",
        "service": "ftp",
    },
    {
        "type": "Phishing",
        "severity": "Medium",
        "source": "Email Gateway",
        "target": "Multiple Users",
        "details": "Suspicious email campaign targeting financial department.",
        "status": "Active",
        "protocol_type": "tcp",
        "service": "smtp",
    },
    {
        "type": "Zero-Day Exploit",
        "severity": "Critical",
        "source": "91.204.55.78",
        "target": "Web Application Server",
        "details": "Unknown attack pattern detected. Possible zero-day exploit targeting application vulnerabilities.",
        "status": "Active",
        "protocol_type": "tcp",
        "service": "http",
    }
]

# Merge dictionaries properly
selected_threat = random.choice(threats)
newData = {**fixed_data, **selected_threat}


# Send the data to the backend
try:
    response = requests.post(API_URL, json=newData)
    response.raise_for_status()  # Raises HTTPError for bad responses (4xx or 5xx)
    print("Status:", response.status_code)
    print("Response:", response.json())
except requests.exceptions.RequestException as e:
    print("Request failed:", e)
except ValueError:
    print("Failed to parse JSON response:", response.text)
