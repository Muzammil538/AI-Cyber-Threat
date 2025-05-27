import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Create directories for models and visualizations
os.makedirs('models', exist_ok=True)
os.makedirs('visualizations', exist_ok=True)

print("Loading and preprocessing NSL-KDD dataset...")

# Load the NSL-KDD dataset
# You would need to download this dataset from: https://www.unb.ca/cic/datasets/nsl.html
# For this example, we'll assume you have KDDTrain+.txt and KDDTest+.txt files

# Column names for NSL-KDD dataset
col_names = [
    'duration', 'protocol_type', 'service', 'flag', 'src_bytes', 'dst_bytes',
    'land', 'wrong_fragment', 'urgent', 'hot', 'num_failed_logins', 'logged_in',
    'num_compromised', 'root_shell', 'su_attempted', 'num_root', 'num_file_creations',
    'num_shells', 'num_access_files', 'num_outbound_cmds', 'is_host_login',
    'is_guest_login', 'count', 'srv_count', 'serror_rate', 'srv_serror_rate',
    'rerror_rate', 'srv_rerror_rate', 'same_srv_rate', 'diff_srv_rate',
    'srv_diff_host_rate', 'dst_host_count', 'dst_host_srv_count', 'dst_host_same_srv_rate',
    'dst_host_diff_srv_rate', 'dst_host_same_src_port_rate', 'dst_host_srv_diff_host_rate',
    'dst_host_serror_rate', 'dst_host_srv_serror_rate', 'dst_host_rerror_rate',
    'dst_host_srv_rerror_rate', 'class', 'difficulty'
]

try:
    # For demonstration purposes, we'll simulate loading the dataset
    # In a real scenario, you'd use:
    # train_data = pd.read_csv('KDDTrain+.txt', header=None, names=col_names)
    # test_data = pd.read_csv('KDDTest+.txt', header=None, names=col_names)
    
    # For this code, we'll create a simulated dataset
    print("Simulating dataset for demonstration...")
    
    # Create a function to generate synthetic data
    def generate_synthetic_data(n_samples=1000):
        # Generate numeric features
        numeric_features = np.random.rand(n_samples, 38)
        
        # Generate categorical features
        protocols = np.random.choice(['tcp', 'udp', 'icmp'], n_samples)
        services = np.random.choice(['http', 'ftp', 'smtp', 'ssh', 'dns'], n_samples)
        flags = np.random.choice(['SF', 'S0', 'REJ', 'RSTO'], n_samples)
        
        # Generate labels: normal, dos, probe, r2l, u2r
        labels = np.random.choice(['normal', 'dos', 'probe', 'r2l', 'u2r'], 
                                 n_samples, p=[0.6, 0.2, 0.1, 0.07, 0.03])
        
        # Create DataFrame
        df = pd.DataFrame(numeric_features, columns=[col for col in col_names 
                                                 if col not in ['protocol_type', 'service', 'flag', 'class', 'difficulty']])
        
        df['protocol_type'] = protocols
        df['service'] = services
        df['flag'] = flags
        df['class'] = labels
        df['difficulty'] = np.random.randint(0, 21, n_samples)
        
        # Reorder columns to match col_names
        return df[col_names]
    
    # Generate synthetic data
    train_data = generate_synthetic_data(10000)
    test_data = generate_synthetic_data(2000)
    
    # Check for DataFrame creation
    if train_data.empty or test_data.empty:
        raise ValueError("Failed to create synthetic datasets")
    
    print(f"Training data shape: {train_data.shape}")
    print(f"Testing data shape: {test_data.shape}")

    # Data preprocessing
    print("Preprocessing data...")
    
    # Drop the 'difficulty' column as it's not needed for classification
    train_data.drop('difficulty', axis=1, inplace=True)
    test_data.drop('difficulty', axis=1, inplace=True)
    
    # Convert attack classes to categories
    # In NSL-KDD, there are 5 main categories: normal, DoS, Probe, R2L, U2R
    def categorize_attack(attack):
        dos_attacks = ['neptune', 'smurf', 'pod', 'teardrop', 'land', 'back', 'apache2']
        probe_attacks = ['ipsweep', 'nmap', 'portsweep', 'satan', 'mscan', 'saint']
        r2l_attacks = ['guesspasswd', 'ftp_write', 'imap', 'phf', 'multihop', 'warezmaster', 
                      'warezclient', 'spy', 'xlock', 'xsnoop', 'snmpguess', 'snmpgetattack', 
                      'httptunnel', 'sendmail', 'named']
        u2r_attacks = ['buffer_overflow', 'loadmodule', 'rootkit', 'perl', 'sqlattack', 'xterm', 'ps']
        
        if attack == 'normal':
            return 'normal'
        elif attack in dos_attacks:
            return 'dos'
        elif attack in probe_attacks:
            return 'probe'
        elif attack in r2l_attacks:
            return 'r2l'
        elif attack in u2r_attacks:
            return 'u2r'
        else:
            # For any other attacks not categorized
            return 'other'
    
    # For synthetic data, we already have the categories, but in real data you'd map detailed attack names to categories
    # train_data['class'] = train_data['class'].apply(categorize_attack)
    # test_data['class'] = test_data['class'].apply(categorize_attack)
    
    # Handle categorical features
    print("Encoding categorical features...")
    categorical_columns = ['protocol_type', 'service', 'flag']
    
    # Apply one-hot encoding to categorical features
    train_categorical = pd.get_dummies(train_data[categorical_columns], drop_first=True)
    test_categorical = pd.get_dummies(test_data[categorical_columns], drop_first=True)
    
    # Ensure test set has all columns from train set
    for col in train_categorical.columns:
        if col not in test_categorical.columns:
            test_categorical[col] = 0
    
    # Match the column order
    test_categorical = test_categorical[train_categorical.columns]
    
    # Separate features and target
    X_train = pd.concat([train_data.drop(categorical_columns + ['class'], axis=1), train_categorical], axis=1)
    y_train = train_data['class']
    
    # Line 136: Save feature columns for use during prediction
    feature_columns = X_train.columns
    with open('models/feature_columns.pkl', 'wb') as f:
        pickle.dump(feature_columns, f)
    
    X_test = pd.concat([test_data.drop(categorical_columns + ['class'], axis=1), test_categorical], axis=1)
    y_test = test_data['class']
    
    # Standardize numerical features
    print("Standardizing numerical features...")
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    
    # Save the scaler
    with open('models/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    # Encode target labels
    le = LabelEncoder()
    y_train_encoded = le.fit_transform(y_train)
    y_test_encoded = le.transform(y_test)
    
    # Save the label encoder
    with open('models/label_encoder.pkl', 'wb') as f:
        pickle.dump(le, f)
    
    # Train classification model
    print("Training classification model (Random Forest)...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train_encoded)
    
    # Save the classification model
    with open('models/classification_model.pkl', 'wb') as f:
        pickle.dump(clf, f)
    
    # Evaluate classification model
    y_pred = clf.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test_encoded, y_pred, target_names=le.classes_))
    
    # Create confusion matrix visualization
    plt.figure(figsize=(10, 8))
    cm = confusion_matrix(y_test_encoded, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=le.classes_, yticklabels=le.classes_)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig('visualizations/confusion_matrix.png')
    
    # Train anomaly detection model
    print("\nTraining anomaly detection model (Isolation Forest)...")
    # We'll train this on normal traffic data only
    normal_idx = y_train == 'normal'
    X_train_normal = X_train[normal_idx]
    
    anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
    anomaly_detector.fit(X_train_normal)
    
    # Save the anomaly detection model
    with open('models/anomaly_detector.pkl', 'wb') as f:
        pickle.dump(anomaly_detector, f)
    
    # Evaluate anomaly detection model
    # For demonstration, we'll predict on the test set
    anomaly_scores = anomaly_detector.decision_function(X_test)
    anomaly_predictions = anomaly_detector.predict(X_test)
    
    # Convert predictions (-1 for anomaly, 1 for normal) to 0 for normal, 1 for anomaly
    anomaly_predictions = np.where(anomaly_predictions == 1, 0, 1)
    
    # Calculate true anomalies (non-normal traffic)
    true_anomalies = np.where(y_test != 'normal', 1, 0)
    
    # Calculate some metrics
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    
    print("\nAnomaly Detection Results:")
    print(f"Accuracy: {accuracy_score(true_anomalies, anomaly_predictions):.4f}")
    print(f"Precision: {precision_score(true_anomalies, anomaly_predictions, zero_division=0):.4f}")
    print(f"Recall: {recall_score(true_anomalies, anomaly_predictions):.4f}")
    print(f"F1 Score: {f1_score(true_anomalies, anomaly_predictions):.4f}")
    
    # Create feature importance visualization for the classification model
    plt.figure(figsize=(12, 8))
    feature_names = list(train_data.drop(categorical_columns + ['class'], axis=1).columns) + list(train_categorical.columns)
    importances = clf.feature_importances_
    indices = np.argsort(importances)[-20:]  # Get top 20 features
    
    plt.barh(range(len(indices)), importances[indices])
    plt.yticks(range(len(indices)), [feature_names[i] for i in indices])
    plt.title('Top 20 Feature Importances')
    plt.tight_layout()
    plt.savefig('visualizations/feature_importance.png')
    
    print("\nTraining completed successfully!")
    print("Models saved in the 'models' directory")
    print("Visualizations saved in the 'visualizations' directory")

except Exception as e:
    print(f"Error during training: {str(e)}")